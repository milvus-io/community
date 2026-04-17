---
id: data-addressing-storage-systems.md
title: >-
  Mendalami Pengalamatan Data dalam Sistem Penyimpanan: Dari HashMap hingga
  HDFS, Kafka, Milvus, dan Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  Telusuri cara kerja pengalamatan data dari HashMap hingga HDFS, Kafka, Milvus,
  dan Iceberg - dan mengapa lokasi komputasi mengalahkan pencarian di setiap
  skala.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>Jika Anda bekerja pada sistem backend atau penyimpanan terdistribusi, Anda mungkin pernah melihat hal ini: jaringan tidak jenuh, mesin tidak kelebihan beban, namun pencarian sederhana memicu ribuan disk I/O atau panggilan API penyimpanan objek - dan kueri masih memerlukan waktu beberapa detik.</p>
<p>Hambatannya jarang terjadi pada bandwidth atau komputasi. Ini adalah <em>pengalamatan</em> - pekerjaan yang dilakukan sistem untuk mencari tahu di mana data berada sebelum dapat membacanya. <strong>Pengalamatan data</strong> adalah proses menerjemahkan pengenal logis (kunci, jalur file, offset, predikat kueri) ke dalam lokasi fisik data pada penyimpanan. Dalam skala besar, proses ini - bukan transfer data yang sebenarnya - mendominasi latensi.</p>
<p>Kinerja penyimpanan dapat direduksi menjadi model yang sederhana:</p>
<blockquote>
<p><strong>Total biaya pengalamatan = akses metadata + akses data</strong></p>
</blockquote>
<p>Hampir semua pengoptimalan penyimpanan - mulai dari tabel hash hingga lapisan metadata lakehouse - menargetkan persamaan ini. Tekniknya beragam, tetapi tujuannya selalu sama: menemukan data dengan sesedikit mungkin operasi latensi tinggi.</p>
<p>Artikel ini menelusuri ide tersebut di seluruh sistem dengan skala yang semakin besar - dari struktur data dalam memori seperti HashMap, ke sistem terdistribusi seperti HDFS dan Apache Kafka, dan akhirnya ke mesin modern seperti <a href="https://milvus.io/">Milvus</a> ( <a href="https://zilliz.com/learn/what-is-a-vector-database">basis data vektor</a>) dan Apache Iceberg yang beroperasi pada penyimpanan objek. Terlepas dari perbedaannya, semuanya mengoptimalkan persamaan yang sama.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Tiga Teknik Pengalamatan Inti<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Di seluruh sistem penyimpanan dan mesin terdistribusi, sebagian besar pengoptimalan pengalamatan terbagi dalam tiga teknik:</p>
<ul>
<li><strong>Komputasi</strong> - Mendapatkan lokasi data secara langsung dari rumus, alih-alih memindai atau menelusuri struktur untuk menemukannya.</li>
<li><strong>Caching</strong> - Menyimpan metadata atau indeks yang sering diakses dalam memori untuk menghindari pembacaan latensi tinggi yang berulang-ulang dari disk atau penyimpanan jarak jauh.</li>
<li><strong>Pemangkasan</strong> - Gunakan informasi rentang atau batas partisi untuk mengesampingkan file, pecahan, atau simpul yang tidak dapat memuat hasil.</li>
</ul>
<p>Di sepanjang artikel ini, <em>akses</em> berarti operasi apa pun dengan biaya tingkat sistem yang nyata: pembacaan disk, panggilan jaringan, atau permintaan API penyimpanan objek. Komputasi CPU tingkat nanodetik tidak dihitung. Yang penting adalah mengurangi jumlah operasi I/O - atau mengubah I/O acak yang mahal menjadi pembacaan berurutan yang lebih murah.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">Bagaimana Pengalamatan Bekerja: Masalah Dua Jumlah<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk membuat pengalamatan menjadi konkret, pertimbangkan masalah algoritma klasik. Diberikan sebuah larik bilangan bulat <code translate="no">nums</code> dan sebuah nilai target <code translate="no">target</code>, kembalikan indeks dari dua bilangan yang dijumlahkan ke <code translate="no">target</code>.</p>
<p>Sebagai contoh <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → hasil <code translate="no">[0, 1]</code>.</p>
<p>Masalah ini dengan jelas menggambarkan perbedaan antara pencarian data dan komputasi di mana data itu berada.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Solusi 1: Pencarian Brute-Force</h3><p>Pendekatan brute-force memeriksa setiap pasangan. Untuk setiap elemen, pendekatan ini memindai larik lainnya untuk mencari kecocokan. Sederhana, tetapi membutuhkan waktu O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>Tidak ada gambaran di mana jawabannya. Setiap pencarian dimulai dari awal dan menelusuri larik secara membabi buta. Hambatannya bukan pada aritmatika - tetapi pada pemindaian yang berulang-ulang.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Solusi 2: Pengalamatan Langsung melalui Komputasi</h3><p>Solusi yang dioptimalkan menggantikan pemindaian dengan HashMap. Alih-alih mencari nilai yang cocok, solusi ini menghitung nilai yang dibutuhkan dan mencarinya secara langsung. Kompleksitas waktu turun menjadi O(n).</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>Pergeseran: alih-alih memindai larik untuk mencari kecocokan, Anda menghitung apa yang Anda butuhkan dan langsung menuju ke lokasinya. Setelah lokasi dapat diperoleh, penjelajahan menghilang.</p>
<p>Ini adalah ide yang sama di balik setiap sistem penyimpanan berkinerja tinggi yang akan kita bahas: mengganti pemindaian dengan komputasi, dan jalur pencarian tidak langsung dengan pengalamatan langsung.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap: Bagaimana Alamat yang Dihitung Menggantikan Pemindaian<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap menyimpan pasangan kunci-nilai dan menemukan nilai dengan menghitung alamat dari kunci - bukan dengan mencari melalui entri. Diberikan sebuah kunci, ia menerapkan fungsi hash, menghitung indeks larik, dan melompat langsung ke lokasi tersebut. Tidak diperlukan pemindaian.</p>
<p>Ini adalah bentuk paling sederhana dari prinsip yang mendorong semua sistem dalam artikel ini: menghindari pemindaian dengan mendapatkan lokasi melalui perhitungan. Ide yang sama - yang mendasari segala sesuatu mulai dari pencarian metadata terdistribusi hingga <a href="https://zilliz.com/learn/vector-index">indeks vektor</a> - muncul di setiap skala.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">Struktur Data Inti</h3><p>Pada intinya, HashMap dibangun di sekitar struktur tunggal: larik. Fungsi hash memetakan kunci ke indeks larik. Karena ruang kunci jauh lebih besar daripada larik, tabrakan tidak dapat dihindari - kunci yang berbeda dapat melakukan hash ke indeks yang sama. Hal ini ditangani secara lokal di dalam setiap slot menggunakan senarai berantai atau pohon merah-hitam.</p>
<p>Larik menyediakan akses waktu konstan berdasarkan indeks. Properti ini - pengalamatan langsung dan dapat diprediksi - adalah dasar dari kinerja HashMap, dan prinsip yang sama yang mendasari akses data yang efisien dalam sistem penyimpanan berskala besar.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">Bagaimana Cara HashMap Menemukan Data?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>Pengalamatan HashMap langkah demi langkah: hash kunci, hitung indeks larik, lompat langsung ke bucket, dan selesaikan secara lokal - mencapai pencarian O(1) tanpa penjelajahan</span> </span></p>
<p>Ambil <code translate="no">put(&quot;apple&quot;, 100)</code> sebagai contoh. Seluruh pencarian membutuhkan empat langkah - tidak ada pemindaian tabel penuh:</p>
<ol>
<li><strong>Hash kunci:</strong> Masukkan kunci melalui fungsi hash → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Memetakan ke sebuah indeks larik:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → contoh, <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Lompat ke ember:</strong> Mengakses <code translate="no">table[10]</code> secara langsung - akses memori tunggal, bukan penjelajahan</li>
<li><strong>Selesaikan secara lokal:</strong> Jika tidak ada tabrakan, baca atau tulis dengan segera. Jika ada tabrakan, periksa sebuah daftar taut kecil atau pohon merah-hitam di dalam ember tersebut.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">Mengapa Pencarian HashMap adalah O(1)?</h3><p>Akses larik adalah O(1) karena rumus pengalamatan yang sederhana:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Diberikan sebuah indeks, alamat memori dihitung dengan satu perkalian dan satu penambahan. Biaya tetap terlepas dari ukuran larik - satu komputasi, satu pembacaan memori. Senarai berantai, sebaliknya, harus dilalui simpul demi simpul, mengikuti pointer melalui lokasi memori yang terpisah: O(n) dalam kasus terburuk.</p>
<p>Sebuah HashMap meng-hash sebuah kunci ke dalam sebuah indeks larik, mengubah apa yang seharusnya merupakan sebuah penjelajahan menjadi sebuah alamat yang dikomputasi. Alih-alih mencari data, ia menghitung dengan tepat di mana data berada dan melompat ke sana.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">Bagaimana Pengalamatan Berubah dalam Sistem Terdistribusi?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap menyelesaikan pengalamatan dalam satu mesin, di mana data berada dalam memori dan biaya aksesnya tidak terlalu besar. Pada skala yang lebih besar, kendala berubah secara dramatis:</p>
<table>
<thead>
<tr><th>Faktor Skala</th><th>Dampak</th></tr>
</thead>
<tbody>
<tr><td>Ukuran data</td><td>Megabyte → terabyte atau petabyte di seluruh cluster</td></tr>
<tr><td>Media penyimpanan</td><td>Memori → disk → jaringan → penyimpanan objek</td></tr>
<tr><td>Latensi akses</td><td>Memori: ~100 ns / Disk: 10-20 ms / Jaringan DC yang sama: ~ 0,5 ms / Lintas wilayah: ~ 150 ms</td></tr>
</tbody>
</table>
<p>Masalah pengalamatan tidak berubah - hanya saja menjadi lebih mahal. Setiap pencarian mungkin melibatkan lompatan jaringan dan I/O disk, sehingga mengurangi jumlah akses jauh lebih penting daripada memori.</p>
<p>Untuk melihat bagaimana sistem nyata menangani hal ini, kita akan melihat dua contoh klasik. HDFS menerapkan pengalamatan berbasis komputasi pada berkas-berkas besar berbasis blok. Kafka menerapkannya pada aliran pesan yang hanya ditambahkan. Keduanya mengikuti prinsip yang sama: menghitung di mana data berada, bukan mencarinya.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: Mengalamatkan File Besar dengan Metadata Dalam Memori<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS adalah sistem <a href="https://milvus.io/docs/architecture_overview.md">penyimpanan terdistribusi</a> yang dirancang untuk file yang sangat besar di seluruh kelompok mesin. Diberikan jalur file dan offset byte, sistem ini perlu menemukan blok data yang tepat dan DataNode yang menyimpannya.</p>
<p>HDFS memecahkan masalah ini dengan pilihan desain yang disengaja: menyimpan semua metadata sistem berkas di dalam memori.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>Organisasi data HDFS menunjukkan tampilan logis dari file 300MB yang dipetakan ke penyimpanan fisik sebagai tiga blok yang didistribusikan ke seluruh DataNode dengan replikasi</span> </span></p>
<p>Di bagian tengah adalah NameNode. NameNode memuat seluruh pohon sistem berkas - struktur direktori, pemetaan berkas-ke-blok, dan pemetaan blok-ke-DataNode - ke dalam memori. Karena metadata tidak pernah menyentuh disk selama pembacaan, HDFS menyelesaikan semua pertanyaan pengalamatan hanya melalui pencarian dalam memori.</p>
<p>Secara konseptual, ini adalah HashMap pada skala cluster: menggunakan struktur data dalam memori untuk mengubah pencarian yang lambat menjadi pencarian yang cepat dan terkomputasi. Perbedaannya adalah HDFS menerapkan prinsip yang sama pada kumpulan data yang tersebar di ribuan mesin.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">Bagaimana HDFS Menemukan Data?</h3><p>Pertimbangkan untuk membaca data pada offset 200 MB dari <code translate="no">/user/data/bigfile.txt</code>, dengan ukuran blok default 128 MB:</p>
<ol>
<li>Klien mengirimkan satu RPC ke NameNode</li>
<li>NameNode menyelesaikan jalur file dan menghitung bahwa offset 200 MB berada di blok kedua (kisaran 128-256 MB) - seluruhnya di dalam memori</li>
<li>NameNode mengembalikan DataNode yang menyimpan blok tersebut (misalnya, DN2 dan DN3)</li>
<li>Klien membaca langsung dari DataNode terdekat (DN2)</li>
</ol>
<p>Total biaya: satu RPC, beberapa pencarian dalam memori, satu pembacaan data. Metadata tidak pernah menyentuh disk selama proses ini, dan setiap pencarian bersifat konstan. HDFS menghindari pemindaian metadata yang mahal bahkan ketika data berskala besar.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: Bagaimana Pengindeksan Jarang Menghindari I/O Acak<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka dirancang untuk aliran pesan dengan kecepatan tinggi. Dengan adanya offset pesan, Kafka harus menemukan posisi byte yang tepat pada disk - tanpa mengubah pembacaan menjadi I/O acak.</p>
<p>Kafka menggabungkan penyimpanan berurutan dengan indeks dalam memori yang jarang. Alih-alih mencari melalui data, Kafka menghitung perkiraan lokasi dan melakukan pemindaian kecil dan terbatas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>Organisasi data Kafka menunjukkan tampilan logis dengan topik dan partisi yang dipetakan ke penyimpanan fisik sebagai direktori partisi yang berisi file segmen .log, .index, dan .timeindex</span> </span></p>
<p>Pesan disusun sebagai Topik → Partisi → Segmen. Setiap partisi adalah log yang hanya dapat ditambahkan yang dibagi menjadi beberapa segmen, yang masing-masing terdiri dari:</p>
<ul>
<li>File <code translate="no">.log</code> yang menyimpan pesan secara berurutan pada disk</li>
<li>File <code translate="no">.index</code> yang bertindak sebagai indeks jarang ke dalam log</li>
</ul>
<p>File <code translate="no">.index</code> dipetakan dalam memori (mmap), sehingga pencarian indeks dilayani secara langsung dari memori tanpa I/O disk.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Desain indeks jarang Kafka menunjukkan satu entri indeks per 4KB data, dengan perbandingan memori: indeks padat pada 800MB versus indeks jarang hanya dengan 2MB yang ada di memori</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Bagaimana Kafka Menemukan Data?</h3><p>Misalkan seorang konsumen membaca pesan dengan offset 500.000. Kafka menyelesaikan ini dalam tiga langkah:</p>
<p><strong>1. Temukan segmen</strong> (pencarian TreeMap)</p>
<ul>
<li>Offset dasar segmen: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>File target: <code translate="no">00000000000000367834.log</code></li>
<li>Kompleksitas waktu: O(log S), di mana S adalah jumlah segmen (biasanya &lt; 100)</li>
</ul>
<p><strong>2. Cari posisi dalam indeks jarang</strong> (.index)</p>
<ul>
<li>Pergeseran relatif: <code translate="no">500000 − 367834 = 132166</code></li>
<li>Pencarian biner di <code translate="no">.index</code>: temukan entri terbesar ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>Kompleksitas waktu: O(log N), di mana N adalah jumlah entri indeks</li>
</ul>
<p><strong>3. Pembacaan berurutan dari log</strong> (.log)</p>
<ul>
<li>Mulai membaca dari posisi 20.500.000</li>
<li>Lanjutkan hingga offset 500.000 tercapai</li>
<li>Paling banyak satu interval indeks (~4 KB) dipindai</li>
</ul>
<p>Total: satu pencarian segmen dalam memori, satu pencarian indeks, satu pembacaan berurutan pendek. Tidak ada akses disk secara acak.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS vs Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
<tr><th>Dimensi</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Tujuan desain</td><td>Penyimpanan dan pembacaan file besar yang efisien</td><td>Pembacaan/penulisan berurutan dengan kecepatan tinggi untuk aliran pesan</td></tr>
<tr><td>Model pengalamatan</td><td>Jalur → blok → DataNode melalui HashMaps dalam memori</td><td>Offset → segmen → posisi melalui indeks jarang + pemindaian berurutan</td></tr>
<tr><td>Penyimpanan metadata</td><td>Terpusat dalam memori NameNode</td><td>File lokal, dipetakan dalam memori melalui mmap</td></tr>
<tr><td>Biaya akses per pencarian</td><td>1 pembacaan blok RPC + N</td><td>1 pencarian indeks + 1 pembacaan data</td></tr>
<tr><td>Pengoptimalan kunci</td><td>Semua metadata dalam memori - tidak ada disk di jalur pencarian</td><td>Pengindeksan yang jarang + tata letak berurutan menghindari I / O acak</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Mengapa Penyimpanan Objek Mengubah Masalah Pengalamatan<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Dari HashMap hingga HDFS dan Kafka, kita telah melihat pengalamatan dalam memori dan penyimpanan terdistribusi klasik. Seiring dengan perkembangan beban kerja, kebutuhan terus meningkat:</p>
<ul>
<li><strong>Kueri yang lebih kaya.</strong> Sistem modern menangani filter multi-bidang, <a href="https://zilliz.com/glossary/similarity-search">pencarian kemiripan</a>, dan predikat yang rumit - bukan hanya kunci dan offset sederhana.</li>
<li><strong>Penyimpanan objek sebagai standar.</strong> Data semakin banyak disimpan di penyimpanan yang kompatibel dengan S3. File tersebar di seluruh bucket, dan setiap akses adalah panggilan API dengan latensi tetap dalam hitungan puluhan milidetik - bahkan untuk beberapa kilobyte.</li>
</ul>
<p>Pada titik ini, latensi - bukan bandwidth - adalah hambatannya. Satu permintaan S3 GET membutuhkan waktu ~50 ms, berapa pun jumlah data yang dikembalikan. Jika sebuah kueri memicu ribuan permintaan seperti itu, total latensi akan membengkak. Meminimalkan penyebaran API menjadi kendala desain utama.</p>
<p>Kita akan melihat dua sistem modern - <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/learn/what-is-a-vector-database">database vektor</a>, dan Apache Iceberg, sebuah format tabel danau - untuk melihat bagaimana mereka mengatasi tantangan ini. Terlepas dari perbedaannya, keduanya menerapkan ide inti yang sama: meminimalkan akses latensi tinggi, mengurangi fan-out lebih awal, dan mengutamakan komputasi daripada penjelajahan.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: Ketika Penyimpanan Tingkat Lapangan Menciptakan Terlalu Banyak File<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah basis data vektor yang banyak digunakan yang dirancang untuk <a href="https://zilliz.com/glossary/similarity-search">pencarian kemiripan</a> pada <a href="https://zilliz.com/glossary/vector-embeddings">penyematan vektor</a>. Desain penyimpanan awalnya mencerminkan pendekatan pertama yang umum untuk membangun penyimpanan objek: menyimpan setiap bidang secara terpisah.</p>
<p>Di V1, setiap bidang dalam <a href="https://milvus.io/docs/manage-collections.md">koleksi</a> disimpan dalam file binlog terpisah di seluruh <a href="https://milvus.io/docs/glossary.md">segmen</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Tata letak penyimpanan Milvus V1 yang menunjukkan koleksi yang dipecah menjadi beberapa segmen, dengan setiap segmen menyimpan bidang seperti id, vektor, dan data skalar dalam file binlog terpisah, ditambah file stats_log terpisah untuk statistik file</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Bagaimana Milvus V1 Menemukan Data?</h3><p>Pertimbangkan sebuah kueri sederhana: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Pencarian metadata</strong> - Query etcd/MySQL untuk daftar segmen → <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Baca bidang id di seluruh segmen</strong> - Untuk setiap segmen, baca file binlog id</li>
<li><strong>Cari baris target</strong> - Pindai data id yang dimuat untuk menemukannya <code translate="no">id = 123</code></li>
<li><strong>Baca bidang vektor</strong> - Baca file binlog vektor yang sesuai untuk segmen yang cocok</li>
</ol>
<p>Total akses file: <strong>N × (F₁ + F₂ + ...)</strong> di mana N = jumlah segmen, F = file binlog per bidang.</p>
<p>Perhitungannya menjadi sangat cepat. Untuk koleksi dengan 100 bidang, 1.000 segmen, dan 5 file binlog per bidang:</p>
<blockquote>
<p><strong>1.000 × 100 × 5 = 500.000 berkas</strong></p>
</blockquote>
<p>Bahkan jika sebuah kueri hanya menyentuh tiga bidang, itu berarti 15.000 panggilan API penyimpanan objek. Pada 50 ms per permintaan S3, latensi serial mencapai <strong>750 detik</strong> - lebih dari 12 menit untuk satu kueri.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: Bagaimana Parket Tingkat Segmen Memangkas Panggilan API hingga 10x lipat<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk memperbaiki batas skalabilitas di V1, Milvus V2 membuat perubahan mendasar: mengatur data per <a href="https://milvus.io/docs/glossary.md">segmen</a>, bukan per field. Daripada banyak file binlog kecil, V2 mengkonsolidasikan data ke dalam file Parket berbasis segmen.</p>
<p>Jumlah file turun dari <code translate="no">N × fields × binlogs</code> menjadi sekitar <code translate="no">N</code> (satu kelompok file per segmen).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Tata letak penyimpanan Milvus V2 yang menunjukkan segmen yang disimpan sebagai file Parket dengan kelompok baris yang berisi potongan kolom untuk id, vektor, dan stempel waktu, ditambah catatan kaki dengan skema dan statistik kolom</span> </span></p>
<p>Tetapi V2 tidak menyimpan semua bidang dalam satu file. V2 mengelompokkan bidang berdasarkan ukuran:</p>
<ul>
<li><strong> <a href="https://milvus.io/docs/scalar_index.md">Bidang skalar</a> kecil</strong> (seperti id, stempel waktu) disimpan bersama</li>
<li><strong>Bidang besar</strong> (seperti <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">vektor padat</a>) dipecah menjadi file khusus</li>
</ul>
<p>Semua file termasuk dalam segmen yang sama, dan baris disejajarkan dengan indeks di seluruh file.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Struktur file parket yang menunjukkan kelompok baris dengan potongan kolom dan halaman data terkompresi, ditambah footer yang berisi metadata file, metadata kelompok baris, dan statistik kolom seperti nilai min/max</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Bagaimana Milvus V2 Menemukan Data?</h3><p>Untuk kueri yang sama - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>Pencarian metadata</strong> - Ambil daftar segmen → <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Baca footer Parket</strong> - Ambil statistik kelompok baris. Periksa min/max kolom id per kelompok baris. <code translate="no">id = 123</code> termasuk dalam Kelompok Baris 0 (min=1, max=1000).</li>
<li><strong>Baca hanya yang diperlukan</strong> - Pemangkasan kolom Parquet hanya membaca kolom id dari file bidang kecil dan hanya kolom <a href="https://milvus.io/docs/index-vector-fields.md">vektor</a> dari file bidang besar. Hanya grup baris yang cocok yang diakses.</li>
</ol>
<p>Memisahkan bidang besar memberikan dua manfaat utama:</p>
<ul>
<li><strong>Pembacaan yang lebih efisien.</strong> <a href="https://zilliz.com/glossary/vector-embeddings">Penyematan vektor</a> mendominasi ukuran penyimpanan. Dicampur dengan bidang kecil, mereka membatasi jumlah baris yang muat dalam kelompok baris, meningkatkan akses file. Mengisolasi mereka memungkinkan kelompok baris bidang kecil menampung lebih banyak baris sementara bidang besar menggunakan tata letak yang dioptimalkan untuk ukurannya.</li>
<li><strong>Evolusi <a href="https://milvus.io/docs/schema.md">skema</a> yang fleksibel.</strong> Menambahkan kolom berarti membuat file baru. Menghapus satu kolom berarti melewatkannya pada saat dibaca. Tidak perlu menulis ulang data historis.</li>
</ul>
<p>Hasilnya: jumlah file berkurang lebih dari 10x lipat, pemanggilan API berkurang lebih dari 10x lipat, dan latensi kueri berkurang dari beberapa menit menjadi beberapa detik.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 vs V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
<tr><th>Aspek</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>Organisasi file</td><td>Dibagi berdasarkan bidang</td><td>Terintegrasi berdasarkan segmen</td></tr>
<tr><td>File per koleksi</td><td>N × bidang × binlog</td><td>~ N × kelompok kolom</td></tr>
<tr><td>Format penyimpanan</td><td>Binlog khusus</td><td>Parket (juga mendukung Lance dan Vortex)</td></tr>
<tr><td>Pemangkasan kolom</td><td>Alami (file tingkat lapangan)</td><td>Pemangkasan kolom parket</td></tr>
<tr><td>Statistik</td><td>Memisahkan file stats_log</td><td>Disematkan di footer Parket</td></tr>
<tr><td>Panggilan API S3 per kueri</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Latensi kueri</td><td>Menit</td><td>Detik</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Gunung Es Apache: Pemangkasan File Berbasis Metadata<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg mengelola tabel analitik pada set data yang sangat besar dalam sistem lakehouse. Ketika sebuah tabel mencakup ribuan file data, tantangannya adalah mempersempit kueri menjadi hanya file yang relevan - tanpa memindai semuanya.</p>
<p>Jawaban Iceberg: tentukan file mana yang akan dibaca <em>sebelum</em> I/O data terjadi, dengan menggunakan metadata berlapis. Ini adalah prinsip yang sama di balik <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">pemfilteran metadata</a> di database vektor - gunakan statistik yang telah dihitung sebelumnya untuk melewatkan data yang tidak relevan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Organisasi data Iceberg menunjukkan direktori metadata dengan metadata.json, daftar manifes, dan file manifes di samping direktori data dengan file Parket yang dipartisi berdasarkan tanggal</span> </span></p>
<p>Iceberg menggunakan struktur metadata berlapis. Setiap lapisan menyaring data yang tidak relevan sebelum lapisan berikutnya dikonsultasikan - mirip dengan bagaimana <a href="https://milvus.io/docs/architecture_overview.md">database terdistribusi</a> memisahkan metadata dari data untuk akses yang efisien.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Arsitektur empat lapisan Iceberg: metadata.json menunjuk ke daftar manifes, yang merujuk ke file manifes yang berisi statistik tingkat file, yang menunjuk ke file data Parket yang sebenarnya</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Bagaimana Iceberg Menemukan Data?</h3><p>Pertimbangkan: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>Baca metadata.json</strong> (1 I/O) - Muat snapshot saat ini dan daftar manifesnya</li>
<li><strong>Baca daftar manifes</strong> (1 I/O) - Terapkan filter <a href="https://milvus.io/docs/use-partition-key.md">tingkat partisi</a> untuk melewatkan seluruh partisi (mis., semua data 2023 dieliminasi)</li>
<li><strong>Baca file manifes</strong> (2 I/O) - Gunakan statistik tingkat file (tanggal min/maks, jumlah min/maks) untuk menghilangkan file yang tidak sesuai dengan kueri</li>
<li><strong>Baca file data</strong> (3 I/O) - Hanya tiga file yang tersisa dan benar-benar dibaca</li>
</ol>
<p>Alih-alih memindai semua 1.000 file data, Iceberg menyelesaikan pencarian dalam <strong>7 operasi I/O</strong> - menghindari lebih dari 94% pembacaan yang tidak perlu.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">Bagaimana Sistem yang Berbeda Mengatasi Data<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
<tr><th>Sistem</th><th>Organisasi Data</th><th>Mekanisme Pengalamatan Inti</th><th>Biaya Akses</th></tr>
</thead>
<tbody>
<tr><td>Peta Hash</td><td>Kunci → slot larik</td><td>Fungsi hash → indeks langsung</td><td>Akses memori O (1)</td></tr>
<tr><td>HDFS</td><td>Jalur → blok → Simpul Data</td><td>HashMaps dalam memori + penghitungan blok</td><td>1 RPC + pembacaan blok N</td></tr>
<tr><td>Kafka</td><td>Topik → Partisi → Segmen</td><td>TreeMap + indeks jarang + pemindaian berurutan</td><td>1 pencarian indeks + 1 pembacaan data</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Koleksi</a> → Segmen → Kolom parket</td><td>Pencarian metadata + pemangkasan kolom</td><td>Pembacaan N (N = segmen)</td></tr>
<tr><td>Gunung es</td><td>Tabel → Cuplikan → Manifes → File data</td><td>Metadata berlapis + pemangkasan statistik</td><td>Pembacaan 3 metadata + pembacaan M data</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Tiga Prinsip di Balik Pengalamatan Data yang Efisien<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. Komputasi Selalu Mengalahkan Pencarian</h3><p>Di setiap sistem yang telah kami periksa, pengoptimalan yang paling efektif mengikuti aturan yang sama: menghitung di mana data berada, bukan mencarinya.</p>
<ul>
<li>HashMap menghitung indeks larik dari <code translate="no">hash(key)</code> alih-alih memindai</li>
<li>HDFS menghitung blok target dari offset file alih-alih menelusuri metadata sistem berkas</li>
<li>Kafka menghitung segmen yang relevan dan posisi indeks alih-alih memindai log</li>
<li>Iceberg menggunakan predikat dan statistik tingkat file untuk menghitung file mana yang layak dibaca</li>
</ul>
<p>Komputasi adalah aritmatika dengan biaya tetap. Pencarian adalah penelusuran - perbandingan, pengejaran penunjuk, atau I/O - dan biayanya bertambah seiring dengan ukuran data. Ketika sebuah sistem dapat memperoleh lokasi secara langsung, pemindaian menjadi tidak diperlukan.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Meminimalkan Akses dengan Latensi Tinggi</h3><p>Hal ini membawa kita kembali ke rumus inti: <strong>Total biaya pengalamatan = akses metadata + akses data.</strong> Setiap pengoptimalan pada akhirnya bertujuan untuk mengurangi operasi dengan latensi tinggi ini.</p>
<table>
<thead>
<tr><th>Pola</th><th>Contoh</th></tr>
</thead>
<tbody>
<tr><td>Kurangi jumlah file untuk membatasi penyebaran API</td><td>Konsolidasi segmen Milvus V2</td></tr>
<tr><td>Gunakan statistik untuk mengesampingkan data lebih awal</td><td>Pemangkasan manifes gunung es</td></tr>
<tr><td>Cache metadata dalam memori</td><td>HDFS NameNode, indeks peta mmap Kafka</td></tr>
<tr><td>Tukar pemindaian berurutan kecil untuk pembacaan acak yang lebih sedikit</td><td>Indeks jarang Kafka</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. Statistik Memungkinkan Keputusan Awal</h3><p>Mencatat informasi sederhana pada waktu penulisan - nilai min/max, batas partisi, jumlah baris - memungkinkan sistem memutuskan pada waktu pembacaan berkas mana yang layak dibaca dan mana yang dapat dilewati.</p>
<p>Ini adalah investasi kecil dengan hasil yang besar. Statistik mengubah akses file dari pembacaan buta menjadi pilihan yang disengaja. Baik itu pemangkasan tingkat manifes dari Iceberg atau statistik footer Parquet dari Milvus V2, prinsipnya sama: beberapa byte metadata pada saat penulisan dapat menghilangkan ribuan operasi I/O pada saat pembacaan.</p>
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
    </button></h2><p>Dari Two Sum ke HashMap, dan dari HDFS dan Kafka ke Milvus dan Apache Iceberg, satu pola terus berulang: performa bergantung pada seberapa efisien sebuah sistem menempatkan data.</p>
<p>Seiring dengan pertumbuhan data dan perpindahan penyimpanan dari memori ke disk ke penyimpanan objek, mekanismenya berubah - tetapi ide intinya tidak berubah. Sistem terbaik menghitung lokasi alih-alih mencari, menjaga metadata tetap dekat, dan menggunakan statistik untuk menghindari menyentuh data yang tidak penting. Setiap kemenangan kinerja yang telah kami teliti berasal dari pengurangan akses latensi tinggi dan mempersempit ruang pencarian sedini mungkin.</p>
<p>Baik Anda merancang pipeline <a href="https://zilliz.com/learn/what-is-vector-search">pencarian vektor</a>, membangun sistem di atas <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data yang tidak terstruktur</a>, atau mengoptimalkan mesin kueri lakehouse, persamaan yang sama berlaku. Memahami bagaimana sistem Anda menangani data adalah langkah pertama untuk membuatnya lebih cepat.</p>
<hr>
<p>Jika Anda bekerja dengan Milvus dan ingin mengoptimalkan kinerja penyimpanan atau kueri Anda, kami ingin membantu:</p>
<ul>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk mengajukan pertanyaan, berbagi arsitektur Anda, dan belajar dari insinyur lain yang menangani masalah serupa.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Milvus Office Hours selama 20 menit gratis</a> untuk membahas kasus penggunaan Anda - baik tata letak penyimpanan, penyetelan kueri, atau penskalaan ke produksi.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (dikelola Milvus) menawarkan tingkat gratis untuk memulai.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang muncul saat teknisi mulai berpikir tentang pengalamatan data dan desain penyimpanan:</p>
<p><strong>T: Mengapa Milvus beralih dari penyimpanan tingkat lapangan ke tingkat segmen?</strong></p>
<p>Di Milvus V1, setiap bidang disimpan dalam file binlog terpisah di seluruh segmen. Untuk koleksi dengan 100 field dan 1.000 segmen, hal ini menciptakan ratusan ribu file kecil - masing-masing membutuhkan panggilan API S3 sendiri. V2 mengkonsolidasikan data ke dalam file Parket berbasis segmen, mengurangi jumlah file hingga lebih dari 10x lipat dan memangkas latensi kueri dari beberapa menit menjadi beberapa detik. Wawasan intinya: pada penyimpanan objek, jumlah panggilan API lebih penting daripada total volume data.</p>
<p><strong>T: Bagaimana Milvus menangani pencarian vektor dan pemfilteran skalar secara efisien?</strong></p>
<p>Milvus V2 menyimpan <a href="https://milvus.io/docs/scalar_index.md">bidang skalar</a> dan <a href="https://milvus.io/docs/index-vector-fields.md">bidang vektor</a> dalam kelompok file terpisah dalam segmen yang sama. Kueri skalar menggunakan pemangkasan kolom Parket dan statistik grup baris untuk melewatkan data yang tidak relevan. <a href="https://zilliz.com/learn/what-is-vector-search">Pencarian vektor</a> menggunakan <a href="https://zilliz.com/learn/vector-index">indeks vektor</a> khusus. Keduanya memiliki struktur segmen yang sama, sehingga <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">kueri hibrida</a> - yang menggabungkan filter skalar dengan kemiripan vektor - dapat beroperasi pada data yang sama tanpa duplikasi.</p>
<p><strong>T: Apakah prinsip "komputasi di atas pencarian" berlaku untuk basis data vektor?</strong></p>
<p>Ya. <a href="https://zilliz.com/learn/vector-index">Indeks vektor</a> seperti HNSW dan IVF dibangun di atas ide yang sama. Alih-alih membandingkan vektor kueri dengan setiap vektor yang tersimpan (pencarian brute-force), mereka menggunakan struktur grafik atau pusat klaster untuk menghitung perkiraan lingkungan dan langsung melompat ke wilayah yang relevan dari ruang vektor. Pengorbanannya - kehilangan akurasi yang kecil untuk perhitungan jarak yang jauh lebih sedikit - adalah pola "komputasi di atas pencarian" yang sama yang diterapkan pada data <a href="https://zilliz.com/glossary/vector-embeddings">penyematan</a> berdimensi tinggi.</p>
<p><strong>T: Apa kesalahan kinerja terbesar yang dilakukan tim dengan penyimpanan objek?</strong></p>
<p>Membuat terlalu banyak file kecil. Setiap permintaan S3 GET memiliki batas latensi tetap (~50 ms), berapa pun jumlah data yang dikembalikan. Sistem yang membaca 10.000 file kecil akan menyeriusi latensi selama 500 detik - meskipun volume data totalnya tidak terlalu besar. Cara mengatasinya adalah konsolidasi: gabungkan berkas-berkas kecil menjadi berkas yang lebih besar, gunakan format kolom seperti Parket untuk pembacaan selektif, dan pertahankan metadata yang memungkinkan Anda melewatkan berkas secara keseluruhan.</p>
