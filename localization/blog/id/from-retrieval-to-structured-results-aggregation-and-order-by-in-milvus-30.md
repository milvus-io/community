---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 'Dari Retrieval ke Hasil Terstruktur: Agregasi dan ORDER BY di Milvus 3.0'
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Pelajari bagaimana Milvus 3.0 menambahkan agregasi kueri, Search Aggregation,
  dan ORDER BY sisi server untuk hasil pencarian vektor yang terstruktur dan
  efisien.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Pertimbangkan alur pencarian produk yang familier. Seorang pembeli mengunggah foto gaun, dan pencarian vektor mengambil kumpulan kandidat yang relevan dari katalog yang berisi puluhan juta produk.</p>
<p>Namun, halaman tersebut membutuhkan lebih dari sekadar daftar berperingkat. Halaman itu membutuhkan facet merek. Halaman itu membutuhkan pengurutan harga. Tim merchandising ingin mengetahui merek mana yang mendominasi kumpulan hasil ini, rentang harga di dalam setiap merek, dan beberapa produk representatif dari setiap grup.</p>
<p>Sebelum Milvus 3.0, aplikasi biasanya menangani langkah kedua itu sendiri: mengambil baris dari Milvus, mengelompokkan dan mengurutkannya di pandas atau lapisan layanan, lalu menyusun respons. Beberapa tim memelihara pipeline analitik terpisah semata-mata untuk menghitung jumlah dan distribusi atas data yang sudah berada di database vektor.</p>
<p>Database vektor menemukan kandidat; aplikasi harus mengubahnya menjadi hasil yang terstruktur.</p>
<p>Milvus 3.0 memindahkan lebih banyak pekerjaan itu ke dalam mesin retrieval. Milvus menambahkan tiga kemampuan yang saling terkait tetapi berbeda:</p>
<ul>
<li><strong>Agregasi kueri</strong> menghitung <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, dan <code translate="no">max</code> atas baris yang terfilter dan terlihat, dengan field <code translate="no">GROUP BY</code> opsional.</li>
<li><strong>Search Aggregation</strong> mengatur kandidat approximate nearest neighbor (ANN) yang dipertahankan ke dalam bucket, menghitung metrik per bucket, membangun bucket bertingkat, dan mengembalikan hit representatif.</li>
<li><strong>Sisi server</strong> <code translate="no">**ORDER BY**</code> mengurutkan hasil kueri atau kandidat ANN berdasarkan satu atau beberapa field skalar sebelum aplikasi menerimanya.</li>
</ul>
<p>Perbedaan antara kueri dan pencarian itu penting:</p>
<table>
<thead>
<tr><th>Kemampuan</th><th>Data yang diringkas atau diurutkan</th><th>Bentuk hasil utama</th><th>Batas ketepatan</th></tr>
</thead>
<tbody>
<tr><td>Agregasi kueri</td><td>Semua baris terlihat yang cocok dengan filter</td><td>Satu baris per grup, dengan nilai agregat</td><td>Tepat atas kumpulan baris terlihat milik kueri</td></tr>
<tr><td>Search Aggregation</td><td>Kandidat yang dipertahankan oleh pencarian ANN dan tahap pengelompokan</td><td>Bucket, metrik, hit representatif, dan bucket anak opsional</td><td>Approximate secara desain</td></tr>
<tr><td>Kueri <code translate="no">ORDER BY</code></td><td>Baris terlihat yang cocok dengan filter</td><td>Baris terurut</td><td>Tepat atas hasil kueri yang terfilter</td></tr>
<tr><td>Pencarian <code translate="no">ORDER BY</code></td><td>Kandidat ANN</td><td>Hit atau grup pencarian terurut</td><td>Tidak memperluas batas recall ANN</td></tr>
</tbody>
</table>
<p>Artikel ini menjelaskan mengapa operasi-operasi ini sebaiknya berada di dalam database, bagaimana agregasi terdistribusi bekerja, bagaimana Search Aggregation berbeda dari Grouping Search, dan di mana semantik baru ini berhenti.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Mengapa pascapemrosesan di sisi aplikasi tidak lagi memadai<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Memindahkan agregasi dan pengurutan ke aplikasi dapat terlihat seperti pilihan implementasi kecil. Pada skala besar, hal itu menciptakan tiga masalah yang lebih besar.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">Aplikasi memindahkan jauh lebih banyak data daripada isi jawabannya</h3><p>Misalkan sebuah dasbor operasi membutuhkan jumlah produk dan harga rata-rata untuk setiap kategori di antara dua juta baris yang tersedia dalam stok. Bahkan dengan payload kasar hanya 100 byte per baris untuk kategori, harga, primary key, dan overhead serialisasi, aplikasi harus menerima sekitar 200 MB data sebelum dapat menghitung hasilnya.</p>
<p>Jika katalog memiliki 200 kategori, jawabannya hanya beberapa ratus key dan angka—dalam kisaran kilobyte. Aplikasi memindahkan data beberapa orde besaran lebih banyak daripada yang dikembalikannya, membayar biaya yang sama pada setiap refresh, dan membutuhkan memori klien yang cukup untuk menahan atau melakukan streaming baris perantara.</p>
<p>Agregasi di dalam mesin mengubah unit perpindahan data. Baris mentah tetap berada di tempatnya. Yang melintasi node dan akhirnya keluar dari Milvus adalah kumpulan status grup parsial dan final yang jauh lebih kecil.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">Pengurutan lokal halaman bukan pengurutan global</h3><p>Mengurutkan setelah paginasi adalah bug kebenaran, bukan sekadar implementasi yang tidak efisien.</p>
<p>Jika aplikasi mengambil baris 11 hingga 20 dan hanya mengurutkan baris-baris itu berdasarkan harga, aplikasi tersebut menghasilkan urutan harga di dalam halaman itu—bukan baris 11 hingga 20 dari hasil yang diurutkan berdasarkan harga secara global. Halaman berikutnya dapat berisi produk yang lebih murah daripada setiap produk di halaman pertama.</p>
<p>Batas yang sama berlaku dalam pencarian vektor. Mengambil kumpulan Top-K kecil dan mengurutkannya di aplikasi hanya dapat mengubah urutan kandidat tersebut. Itu tidak dapat memulihkan kandidat relevan yang tidak dikembalikan tahap ANN, dan sering kali mendorong aplikasi untuk mengambil data berlebihan hanya agar pengurutan sisi klien berguna.</p>
<p>Pengurutan sisi server memberi Milvus kendali atas urutan dan rangkaian paginasi. Untuk workload kueri, mesin mengurutkan kumpulan baris yang terfilter sebelum menerapkan jendela halaman. Untuk workload pencarian, mesin mengurutkan di dalam batas kandidat ANN dan menjaga keterbatasan itu tetap eksplisit.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">Klien tidak dapat mereproduksi visibilitas database</h3><p>Agregasi juga bergantung pada baris mana yang terlihat pada timestamp kueri. Penghapusan, entitas kedaluwarsa, dan penulisan bersamaan diatur oleh multiversion concurrency control (MVCC) dan semantik konsistensi Milvus.</p>
<p>Setelah baris mentah meninggalkan database, aplikasi biasanya mengasumsikan bahwa batch yang diterima mewakili snapshot yang benar. Mere konstruksi aturan visibilitas yang sama di klien tidak praktis, terutama ketika koleksi sedang menerima penulisan dan penghapusan.</p>
<p>Solusi umum—mesin analitik kedua yang diberi data melalui ekspor dan ETL—menambahkan salinan data lain, batas konsistensi lain, dan pipeline lain untuk dioperasikan. Perhitungan jumlah, metrik, dan pengurutan seharusnya berjalan di tempat data dan aturan visibilitasnya sudah berada.</p>
<p>Sekarang, mari kita lihat apa yang ditawarkan Milvus 3.0.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Agregasi kueri: statistik tepat atas baris yang terlihat<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>Agregasi kueri menjawab pertanyaan seperti:</p>
<ul>
<li>Berapa banyak produk yang tersedia dalam stok di setiap kategori?</li>
<li>Berapa harga rata-rata per merek?</li>
<li>Berapa timestamp peristiwa minimum dan maksimum untuk setiap host?</li>
<li>Berapa banyak rekaman yang tersisa setelah filter dan visibilitas TTL diterapkan?</li>
</ul>
<p>API-nya terasa familier bagi siapa pun yang pernah menggunakan SQL: berikan satu atau beberapa field di <code translate="no">group_by_fields</code>, lalu tempatkan ekspresi agregasi di <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sintaksnya adalah bagian yang sederhana. Model eksekusinya yang membuat hasilnya berguna di database vektor terdistribusi.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Status lokal segmen menggantikan perpindahan baris mentah</h3><p>Sebuah koleksi Milvus dapat mencakup ratusan atau ribuan segmen yang didistribusikan di beberapa query node, dengan data yang baru ditulis masih berada di jalur streaming. Tidak ada satu node eksekusi pun yang sejak awal memiliki setiap baris yang terlihat.</p>
<p>Karena itu, Milvus mendorong agregasi turun ke segmen:</p>
<ol>
<li>Setiap segmen menerapkan filter dan aturan visibilitas MVCC secara lokal.</li>
<li>Segmen memancarkan satu status parsial per grup alih-alih baris-baris yang cocok.</li>
<li>Status parsial digabungkan di dalam query node.</li>
<li>Proxy melakukan penggabungan akhir lintas node dan mengembalikan grup yang lengkap.</li>
</ol>
<p>Jumlah data perantara kini diskalakan berdasarkan jumlah grup dan status agregat, bukan secara langsung berdasarkan jumlah baris yang cocok.</p>
<p>Operasi penggabungan bergantung pada agregatnya:</p>
<table>
<thead>
<tr><th>Agregat</th><th>Status parsial</th><th>Aturan penggabungan</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Jumlah parsial</td><td>Tambahkan jumlah</td></tr>
<tr><td><code translate="no">sum</code></td><td>Jumlah parsial</td><td>Tambahkan jumlah</td></tr>
<tr><td><code translate="no">min</code></td><td>Minimum parsial</td><td>Ambil minimum</td></tr>
<tr><td><code translate="no">max</code></td><td>Maksimum parsial</td><td>Ambil maksimum</td></tr>
<tr><td><code translate="no">avg</code></td><td>Jumlah dan hitungan parsial</td><td>Tambahkan kedua status, lalu bagi sekali pada tahap akhir</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> adalah kasus yang instruktif. Merata-ratakan dua rata-rata parsial adalah salah ketika partisi berisi jumlah baris yang berbeda. Milvus membawa <code translate="no">sum</code> dan <code translate="no">count</code> secara independen dan menghitung rata-rata akhir hanya setelah keduanya digabungkan secara global.</p>
<p>Ini adalah salah satu alasan agregasi sebaiknya berada di database: operasinya bukan sekadar “menjalankan fungsi yang sama pada beberapa batch.” Mesin harus mempertahankan aljabar setiap agregat melintasi batas segmen dan node.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">Visibilitas diterapkan sebelum agregasi</h3><p>Baris yang dihapus dan kedaluwarsa dikeluarkan dari status parsial di tingkat segmen sesuai dengan batas visibilitas kueri. Baris-baris itu tidak dikirim ke atas lalu dikoreksi di aplikasi.</p>
<p>Karena itu, hasilnya menggambarkan baris yang dianggap terlihat oleh Milvus untuk permintaan tersebut, bukan kumpulan batch arbitrer yang ditarik pada waktu yang sedikit berbeda.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> kini menghitung grup</h3><p>Dalam kueri normal, <code translate="no">limit</code> mengontrol berapa banyak baris entitas yang dikembalikan. Dalam kueri berkelompok, parameter ini mengontrol berapa banyak grup yang dikembalikan. Karena kardinalitas hasil ditentukan oleh grup, bukan baris yang cocok, agregasi kueri juga dapat menghilangkan <code translate="no">limit</code> ketika membutuhkan setiap grup.</p>
<p>Ini terdengar seperti detail API kecil, tetapi mencerminkan model hasil yang berbeda: output bukan lagi halaman entitas. Output adalah relasi yang baris-barisnya merepresentasikan grup.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation: tampilan berbucket dari kandidat ANN<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>Agregasi kueri menjawab, “Seperti apa baris terlihat yang cocok dengan filter ini?” Search Aggregation mengajukan pertanyaan berbeda: “Seperti apa kumpulan kandidat yang diambil untuk vektor ini?”</p>
<p>Operasi itu tidak memiliki padanan SQL yang tepat. Pencarian ANN terlebih dahulu menetapkan batas kandidat yang didorong oleh kemiripan. Milvus kemudian mengatur kandidat yang dipertahankan berdasarkan key skalar dan mengembalikan pohon bucket alih-alih daftar hit datar biasa.</p>
<p>Sebuah bucket dapat berisi:</p>
<ul>
<li>key seperti <code translate="no">brand</code> atau key komposit seperti <code translate="no">(brand, color)</code>;</li>
<li>jumlah kandidat yang dipertahankan;</li>
<li>metrik termasuk <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, dan <code translate="no">max</code>;</li>
<li>entitas representatif yang dipilih dengan <code translate="no">top_hits</code>; dan</li>
<li><code translate="no">sub_aggregation</code> bertingkat yang membuat bucket anak.</li>
</ul>
<p>Untuk halaman pencarian produk, satu permintaan dapat mengembalikan bucket merek, harga rata-rata di dalam setiap bucket, dan tiga produk representatif per merek:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Ketika <code translate="no">search_aggregation</code> ditetapkan, daftar hit biasa kosong. Aplikasi membaca respons bucket dari <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">Spesifikasi agregasi menetapkan dua batas yang berbeda</h3><p>Search Aggregation tidak menjalankan <code translate="no">GROUP BY</code> atas setiap entitas dalam koleksi, dan tidak sekadar mengambil respons Top-K biasa lalu mengagregasi daftar datar tersebut.</p>
<p>Eksekusinya memiliki tiga tahap:</p>
<ol>
<li>Milvus menjalankan pencarian ANN untuk mengambil kandidat di dekat vektor kueri.</li>
<li>Tahap pengelompokan mempertahankan jumlah kandidat yang dibatasi untuk setiap key bucket penuh.</li>
<li>Milvus membangun bucket, menghitung metrik atas kandidat yang dipertahankan, mengurutkan bucket, dan melampirkan hit representatif atau bucket anak.</li>
</ol>
<p>Dua parameter mengontrol bagian hasil yang berbeda:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> membatasi berapa banyak bucket yang dikembalikan pada tingkat agregasi tersebut.</li>
<li><code translate="no">TopHits.size</code> terbesar di mana pun dalam pohon agregasi menetapkan anggaran kandidat yang dipertahankan untuk setiap key komposit penuh. Jika permintaan tidak berisi <code translate="no">top_hits</code>, anggaran per key default menjadi satu.</li>
</ul>
<p><code translate="no">limit</code> pencarian tingkat atas tidak mengontrol mode ini dan diabaikan ketika <code translate="no">search_aggregation</code> ada.</p>
<p>Perbedaan itu penting saat membaca <code translate="no">count</code> atau metrik sebuah bucket. Dengan <code translate="no">TopHits(size=3)</code>, sebuah bucket merek dapat merangkum paling banyak tiga kandidat yang dipertahankan untuk key penuhnya, bahkan jika koleksi berisi ribuan produk relevan dari merek tersebut. Meningkatkan <code translate="no">TopHits.size</code> memperlebar jendela metrik per key, tetapi tidak mengubah pencarian ANN menjadi pemindaian tepat.</p>
<p>Jika aplikasi membutuhkan statistik tepat atas setiap baris terlihat yang cocok dengan filter, aplikasi sebaiknya menggunakan agregasi kueri. Search Aggregation ditujukan untuk mendeskripsikan dan membandingkan kandidat yang dihasilkan oleh retrieval berbasis kemiripan.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation dan Grouping Search memecahkan masalah yang berbeda<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus telah mendukung Grouping Search (<code translate="no">group_by</code>)sejak Milvus 2.4. Mudah untuk melihat kata “grouping” pada kedua fitur dan mengasumsikan keduanya adalah dua antarmuka untuk operasi yang sama. Kontrak output keduanya berbeda.</p>
<p><strong>Grouping Search</strong> mengubah entitas mana yang muncul dalam daftar hasil berperingkat. Pola RAG umum menyimpan chunk sebagai entitas individual, mengelompokkannya berdasarkan <code translate="no">doc_id</code>, dan mengembalikan satu atau beberapa chunk dari setiap dokumen. Output utama tetap berupa hit pencarian biasa, tetapi dengan lebih sedikit nilai berulang dari field pengelompokan.</p>
<p><strong>Search Aggregation</strong> mengembalikan tampilan statistik. Output utamanya adalah pohon bucket yang berisi key, jumlah, metrik, hit representatif, dan bucket anak opsional.</p>
<table>
<thead>
<tr><th>Kebutuhan aplikasi</th><th>Lebih baik gunakan</th><th>Konsumsi</th></tr>
</thead>
<tbody>
<tr><td>Daftar entitas berperingkat dengan keberagaman lebih besar di suatu field</td><td>Grouping Search</td><td>Hit pencarian biasa</td></tr>
<tr><td>Jumlah facet, metrik per grup, hit representatif, atau distribusi bertingkat</td><td>Search Aggregation</td><td>Objek <code translate="no">AggregationBucket</code> di <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>Aturan praktisnya adalah mulai dari bentuk respons UI atau API. Jika aplikasi merender daftar, Grouping Search biasanya merupakan primitif yang tepat. Jika aplikasi merender facet, kartu distribusi, atau hierarki grup, gunakan Search Aggregation.</p>
<p>Kedua mode saling eksklusif dalam satu permintaan karena keduanya mendefinisikan bentuk hasil utama yang berbeda.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: pindahkan pengurutan sebelum batas aplikasi<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengurutan adalah fitur yang paling tidak eksotis dalam rilis ini dan salah satu yang paling mudah diimplementasikan secara keliru di luar mesin.</p>
<p>Milvus 3.0 mengekspos pengurutan pada kueri maupun pencarian, tetapi kedua jalur menggunakan parameter SDK yang berbeda dan beroperasi atas kumpulan input yang berbeda.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">Pengurutan kueri mengurutkan kumpulan baris yang terfilter</h3><p>Kueri PyMilvus menggunakan <code translate="no">order_by</code>, yang diekspresikan sebagai daftar string <code translate="no">&quot;field:direction&quot;</code>. Mesin menerapkan filter, mengurutkan baris yang terlihat, lalu menerapkan <code translate="no">limit</code> dan <code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Ini membuat kueri berguna untuk penelusuran yang diurutkan secara bisnis: rekaman terbaru yang diingest, produk berharga tertinggi di dalam filter, inventaris terendah, atau nilai ekstrem untuk inspeksi data. Tanpa pengurutan sisi server, aplikasi harus mengambil baris terlebih dahulu dan tidak dapat mendefinisikan urutan bisnis yang andal lintas halaman.</p>
<p>Untuk field kueri yang nullable, urutan naik menempatkan null di akhir dan urutan turun menempatkannya di awal. Field pengurutan tidak harus muncul di <code translate="no">output_fields</code>; sertakan hanya ketika aplikasi membutuhkan nilainya dalam respons.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">Pengurutan pencarian mengubah urutan kumpulan kandidat ANN</h3><p>Pencarian PyMilvus menggunakan <code translate="no">order_by_fields</code>, dengan setiap entri menamai field skalar dan arahnya:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN tetap menentukan entitas mana yang menjadi kandidat. <code translate="no">order_by_fields</code> mengubah bagaimana kandidat tersebut dikembalikan; ini tidak membuat pencarian memindai koleksi secara global untuk produk termurah.</p>
<p>Batas itu memberi kedua API pekerjaan yang berbeda:</p>
<ul>
<li>Gunakan kueri plus <code translate="no">order_by</code> ketika urutan skalar itu sendiri mendefinisikan hasil, seperti sepuluh produk termurah yang tersedia dalam stok.</li>
<li>Gunakan pencarian plus <code translate="no">order_by_fields</code> ketika relevansi semantik atau vektor mendefinisikan kumpulan kandidat dan field skalar menentukan bagaimana kandidat tersebut harus disajikan.</li>
</ul>
<p>Pengurutan multi-field menerapkan key sesuai urutan daftar. Ketika kandidat pencarian memiliki nilai yang sama untuk setiap key skalar yang ditentukan, Milvus mempertahankan urutan skor kemiripan aslinya.</p>
<p>Pengurutan juga dapat dikomposisikan dengan Grouping Search. Milvus mengurutkan grup berdasarkan nilai skalar yang dikonfigurasi dari entitas teratas setiap grup sambil mempertahankan bentuk hasil berkelompok. Ini berguna ketika aplikasi menginginkan keberagaman lintas field sekaligus urutan grup yang relevan secara bisnis.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">Apa yang dimungkinkan oleh kemampuan-kemampuan ini<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>API ini adalah primitif database umum, tetapi beberapa workload retrieval langsung mendapat manfaat.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG dan agen: inspeksi konsentrasi retrieval</h3><p>Sistem RAG atau agentic dapat membucketkan chunk yang diambil berdasarkan dokumen sumber, lini produk, tenant, atau tipe konten. Hasil yang terkonsentrasi di dua dokumen membawa sinyal cakupan yang berbeda dari hasil yang tersebar di puluhan sumber.</p>
<p>Distribusi itu bukan jaminan kualitas jawaban. Namun, distribusi tersebut merupakan diagnostik retrieval yang berguna yang dapat dikombinasikan oleh aplikasi atau agen dengan skor, sitasi, dan pemeriksaan lain saat memutuskan apakah akan memperluas kueri, mengambil ulang, atau meminta klarifikasi.</p>
<p>Grouping Search tetap menjadi pilihan yang tepat ketika tujuannya hanya untuk mendiversifikasi chunk yang dikembalikan. Search Aggregation berguna ketika sistem membutuhkan distribusi itu sendiri.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">E-commerce dan rekomendasi konten: kembalikan facet bersama pencarian</h3><p>Halaman pencarian produk pembuka dapat menerima bucket merek, metrik harga, item representatif, dan daftar kandidat yang diurutkan secara skalar dari Milvus. Aplikasi tetap mengontrol presentasi dan logika bisnis, tetapi tidak lagi perlu merekonstruksi semantik bucket dasar dari hit yang diekspor.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Log dan keamanan: gabungkan kemiripan dengan distribusi insiden</h3><p>Pencarian kemiripan dapat menemukan peristiwa yang terkait dengan baris log mencurigakan. Search Aggregation kemudian dapat menunjukkan host mana yang mendominasi kandidat tersebut, timestamp minimum dan maksimum dalam setiap bucket host, atau bagaimana kandidat terbagi berdasarkan tingkat keparahan dan layanan.</p>
<p>Hasilnya tetap merupakan tampilan atas kandidat yang diambil, bukan jumlah insiden global yang tepat. Ketika investigasi membutuhkan jumlah tepat atas setiap peristiwa yang cocok dengan filter, agregasi kueri menyediakan jalur kedua itu.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Operasi dan eksplorasi data: hitung alih-alih ekspor</h3><p>Dasbor dan alat administratif dapat menjalankan perhitungan jumlah dan rata-rata yang tepat atas baris terfilter, lalu menelusuri entitas yang mendasarinya dalam urutan skalar yang terdefinisi. Ini menghilangkan banyak utilitas sekali pakai “ekspor, hitung, dan urutkan” tanpa berpura-pura bahwa Milvus telah menjadi database analitik penuh.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Batasan: apa yang tidak digantikan oleh agregasi dan <code translate="no">ORDER BY</code><button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>Fitur-fitur ini memperluas mesin retrieval; fitur-fitur ini tidak mengubah Milvus menjadi sistem online analytical processing (OLAP).</p>
<ul>
<li>Agregasi kueri mendukung pengelompokan plus <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code>, dan <code translate="no">max</code>. Ini tidak menambahkan join, window function, atau subquery kompleks. Pekerjaan analitik offline berskala besar tetap sebaiknya berada di sistem seperti Spark, yang dapat bekerja dengan snapshot Milvus 3.0 dan jalur penyimpanan bersama.</li>
<li>Key grup kueri mendukung field integer, <code translate="no">VARCHAR</code>, dan <code translate="no">TIMESTAMPTZ</code>. Key bucket Search Aggregation juga mendukung field Boolean. Nilai floating-point, vektor, JSON, dan array bukan key bucket.</li>
<li>Untuk Search Aggregation, <code translate="no">count</code> menerima <code translate="no">&quot;*&quot;</code> atau sumber non-JSON, non-dinamis; <code translate="no">sum</code> dan <code translate="no">avg</code> memerlukan sumber numerik; dan <code translate="no">min</code> serta <code translate="no">max</code> juga mendukung sumber string dan <code translate="no">TIMESTAMPTZ</code>. Agregasi kueri mengikuti batas tipe aritmetika yang sama. Konsultasikan panduan API sebelum menerapkan agregat ke tipe field kompleks.</li>
<li>Agregasi kueri dapat mengurutkan output berkelompok berdasarkan key grup, sementara pengurutan berdasarkan agregat terhitung seperti <code translate="no">count(*)</code> masih menjadi batasan saat ini. Tanpa urutan eksplisit, urutan grup tidak dijamin.</li>
<li>Search Aggregation saat ini tidak dapat digabungkan dengan Hybrid Search, Grouping Search, Search Iterators, offset non-nol, atau highlighting dalam permintaan yang sama.</li>
<li>Jumlah dan metrik Search Aggregation menggambarkan kandidat ANN yang dipertahankan, bukan koleksi lengkap dan bukan setiap entitas yang mungkin relevan secara semantik.</li>
<li><code translate="no">ORDER BY</code> pencarian mengubah presentasi kandidat. Ini tidak memperbaiki kandidat ANN yang terlewat atau mengubah retrieval berbasis kemiripan menjadi kueri Top-N skalar yang tepat.</li>
</ul>
<p>Cara paling jelas untuk memilih di antara primitif baru ini adalah memulai dari pertanyaannya:</p>
<ul>
<li>Untuk statistik tepat atas baris terlihat yang terfilter, gunakan agregasi kueri.</li>
<li>Untuk distribusi atas kandidat retrieval berbasis kemiripan, gunakan Search Aggregation.</li>
<li>Untuk daftar berperingkat yang beragam, gunakan Grouping Search.</li>
<li>Untuk urutan skalar yang terdefinisi, gunakan kueri atau pencarian <code translate="no">ORDER BY</code> sesuai jalur mana yang menetapkan kumpulan hasil.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">Dari daftar kandidat ke hasil terstruktur<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Database vektor secara tradisional mengoptimalkan satu pertanyaan: entitas K mana yang paling dekat dengan vektor ini?</strong></p>
<p>Sistem retrieval produksi segera mengajukan pertanyaan lanjutan. Grup mana yang mendominasi hasil? Berapa jumlah dan rentangnya? Contoh mana yang merepresentasikan setiap grup? Dalam urutan bisnis apa aplikasi harus menyajikan baris atau kandidat?</p>
<p>Milvus 3.0 membawa operasi-operasi tersebut ke dalam mesin yang sama yang memiliki data, batas kandidat ANN, dan semantik visibilitas. Agregasi kueri melakukan reduksi terdistribusi yang tepat atas baris terlihat. Search Aggregation membangun tampilan berbucket atas kandidat ANN yang dipertahankan. <code translate="no">ORDER BY</code> memberi jalur kueri dan pencarian urutan skalar sisi server tanpa meminta aplikasi untuk merekonstruksinya halaman demi halaman.</p>
<p>Hasilnya bukan mesin OLAP yang tersembunyi di dalam database vektor. Ini adalah mesin retrieval yang dapat mengembalikan lebih banyak struktur yang benar-benar dibutuhkan aplikasi.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Coba agregasi dan <code translate="no">ORDER BY</code> di Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 kini tersedia. Gunakan <a href="https://milvus.io/docs/get-and-scalar-query.md">panduan Query</a> untuk agregasi tepat dan pengurutan kueri, <a href="https://milvus.io/docs/search-aggregation.md">panduan Search Aggregation</a> untuk semantik dan batas bucket, <a href="https://milvus.io/docs/single-vector-search.md">panduan Basic Vector Search</a> untuk pengurutan pencarian, dan <a href="https://milvus.io/docs/grouping-search.md">panduan Grouping Search</a> ketika tujuan utama Anda adalah keberagaman hasil.</p>
<p>Untuk rilis yang lebih luas, lihat <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog peluncuran Milvus 3.0</a>, <a href="https://milvus.io/docs/release_notes.md">catatan rilis Milvus 3.0</a>, dan <a href="https://github.com/milvus-io/milvus">repositori milvus-io/milvus</a>.</p>
<p>Jika Anda ingin mengevaluasi API yang sama tanpa mengoperasikan cluster sendiri, cobalah di <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. <a href="https://docs.zilliz.com/reference/python/python/Vector-query">Referensi kueri Zilliz Cloud</a> dan <a href="https://docs.zilliz.com/reference/python/python/Vector-search">referensi pencarian</a> saat ini menjelaskan ketersediaan dan parameter untuk tipe cluster terkelola.</p>
<p>Untuk mendiskusikan workload atau kasus tepi dengan tim, bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Milvus Discord</a> atau pesan <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">sesi Milvus Office Hours</a>.</p>
