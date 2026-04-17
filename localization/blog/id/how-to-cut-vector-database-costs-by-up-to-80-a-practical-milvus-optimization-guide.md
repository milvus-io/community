---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  Cara Memangkas Biaya Basis Data Vektor Hingga 80%: Panduan Praktis
  Pengoptimalan Milvus
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvus gratis, tetapi infrastrukturnya tidak. Pelajari cara mengurangi biaya
  memori basis data vektor hingga 60-80% dengan indeks, MMap, dan penyimpanan
  berjenjang yang lebih baik.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>Prototipe RAG Anda bekerja dengan baik. Kemudian RAG mulai diproduksi, lalu lintas meningkat, dan sekarang tagihan basis data vektor Anda meningkat dari $500 menjadi $5.000 per bulan. Terdengar tidak asing?</p>
<p>Ini adalah salah satu masalah penskalaan yang paling umum dalam aplikasi AI saat ini. Anda telah membangun sesuatu yang menciptakan nilai nyata, tetapi biaya infrastruktur tumbuh lebih cepat daripada pertumbuhan basis pengguna Anda. Dan ketika Anda melihat tagihannya, basis data vektor sering kali menjadi kejutan terbesar - dalam penerapan yang telah kami lihat, ini dapat mencapai sekitar 40-50% dari total biaya aplikasi, nomor dua setelah pemanggilan API LLM.</p>
<p>Dalam panduan ini, saya akan menjelaskan ke mana uang itu sebenarnya pergi dan hal-hal spesifik yang dapat Anda lakukan untuk menurunkannya - dalam banyak kasus hingga 60-80%. Saya akan menggunakan <a href="https://milvus.io/">Milvus</a>, basis data vektor sumber terbuka yang paling populer, sebagai contoh utama karena itulah yang paling saya ketahui, tetapi prinsip-prinsipnya berlaku untuk sebagian besar basis data vektor.</p>
<p><em>Untuk memperjelas:</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>sendiri gratis dan open source - Anda tidak pernah membayar untuk perangkat lunaknya. Biaya sepenuhnya berasal dari infrastruktur yang Anda gunakan untuk menjalankannya: instans cloud, memori, penyimpanan, dan jaringan. Kabar baiknya adalah sebagian besar dari biaya infrastruktur tersebut dapat dikurangi.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">Ke Mana Sebenarnya Uang Dibelanjakan Saat Menggunakan VectorDB?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita mulai dengan contoh konkret. Katakanlah Anda memiliki 100 juta vektor, 768 dimensi, yang disimpan sebagai float32 - pengaturan RAG yang cukup umum. Inilah kira-kira biaya yang dikeluarkan untuk itu di AWS per bulan:</p>
<table>
<thead>
<tr><th><strong>Komponen Biaya</strong></th><th><strong>Bagian</strong></th><th><strong>~ Biaya Bulanan</strong></th><th><strong>Catatan</strong></th></tr>
</thead>
<tbody>
<tr><td>Komputasi (CPU + memori)</td><td>85-90%</td><td>$2,800</td><td>Yang paling besar - sebagian besar digerakkan oleh memori</td></tr>
<tr><td>Jaringan</td><td>5-10%</td><td>$250</td><td>Lalu lintas lintas lintas-AZ, muatan hasil yang besar</td></tr>
<tr><td>Penyimpanan</td><td>2-5%</td><td>$100</td><td>Murah - penyimpanan objek (S3/MinIO) adalah ~$0,03/GB</td></tr>
</tbody>
</table>
<p>Kesimpulannya sederhana: memori adalah tempat di mana 85-90% dari uang Anda dihabiskan. Jaringan dan penyimpanan adalah hal yang penting, tetapi jika Anda ingin memangkas biaya secara signifikan, memori adalah pengungkitnya. Semua yang ada dalam panduan ini berfokus pada hal itu.</p>
<p><strong>Catatan singkat tentang jaringan dan penyimpanan:</strong> Anda bisa mengurangi biaya jaringan dengan hanya mengembalikan bidang yang Anda perlukan (ID, skor, metadata kunci) dan menghindari permintaan lintas wilayah. Untuk penyimpanan, Milvus sudah memisahkan penyimpanan dari komputasi - vektor Anda berada di penyimpanan objek yang murah seperti S3, jadi bahkan pada 100 juta vektor, penyimpanan biasanya di bawah $50/bulan. Tak satu pun dari hal ini yang akan menggerakkan jarum seperti halnya optimasi memori.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Mengapa Memori Sangat Mahal untuk Pencarian Vektor<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda berasal dari basis data tradisional, kebutuhan memori untuk pencarian vektor bisa jadi mengejutkan. Basis data relasional dapat memanfaatkan indeks B-tree berbasis disk dan cache halaman OS. Pencarian vektor berbeda - pencarian vektor melibatkan komputasi floating-point yang sangat besar, dan indeks seperti HNSW atau IVF harus tetap dimuat dalam memori untuk memberikan latensi tingkat milidetik.</p>
<p>Berikut adalah rumus cepat untuk memperkirakan kebutuhan memori Anda:</p>
<p><strong>Memori yang dibutuhkan = (vektor × dimensi × 4 byte) × pengali indeks</strong></p>
<p>Untuk contoh 100M × 768 × float32 dengan HNSW (pengali ~1,8x):</p>
<ul>
<li>Data mentah: 100M × 768 × 4 byte ≈ 307 GB</li>
<li>Dengan indeks HNSW: 307 GB × 1,8 ≈ 553 GB</li>
<li>Dengan overhead OS, cache, dan ruang kepala: ~ total 768 GB</li>
<li>Di AWS: 3 × r6i.8xlarge (masing-masing 256 GB) ≈ $2.800/bulan</li>
</ul>
<p><strong>Itu adalah angka dasarnya. Sekarang mari kita lihat cara menurunkannya.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Pilih Indeks yang Tepat untuk Mendapatkan Penggunaan Memori 4x Lebih Sedikit<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Ini adalah perubahan dengan dampak paling besar yang dapat Anda lakukan. Untuk dataset vektor 100M yang sama, penggunaan memori dapat bervariasi 4-6x tergantung pada pilihan indeks Anda.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: hampir tidak ada kompresi, sehingga penggunaan memori tetap mendekati ukuran data mentah, sekitar <strong>300 GB</strong></li>
<li><strong>HNSW</strong>: menyimpan struktur grafik ekstra, sehingga penggunaan memori biasanya <strong>1,5x hingga 2,0x</strong> ukuran data mentah, atau sekitar <strong>450 hingga 600 GB</strong></li>
<li><strong>IVF_SQ8</strong>: mengompres nilai float32 menjadi uint8, memberikan <strong>kompresi</strong> sekitar <strong>4x lipat</strong>, sehingga penggunaan memori dapat turun menjadi sekitar <strong>75 hingga 100 GB</strong></li>
<li><strong>IVF_PQ / DiskANN</strong>: menggunakan kompresi yang lebih kuat atau indeks berbasis disk, sehingga memori dapat turun lebih jauh menjadi sekitar <strong>30 hingga 60 GB</strong></li>
</ul>
<p>Banyak tim yang memulai dengan HNSW karena memiliki kecepatan kueri terbaik, tetapi mereka akhirnya membayar 3-5x lebih banyak dari yang seharusnya.</p>
<p>Berikut ini perbandingan jenis-jenis indeks utama:</p>
<table>
<thead>
<tr><th><strong>Indeks</strong></th><th><strong>Pengganda Memori</strong></th><th><strong>Kecepatan Kueri</strong></th><th><strong>Pemanggilan Kembali</strong></th><th><strong>Terbaik Untuk</strong></th></tr>
</thead>
<tbody>
<tr><td>DATAR</td><td>~1.0x</td><td>Lambat</td><td>100%</td><td>Dataset kecil (&lt;1M), pengujian</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Sedang</td><td>95-99%</td><td>Penggunaan umum</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>Sedang</td><td>93-97%</td><td>Produksi yang sensitif terhadap biaya (disarankan)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>Cepat</td><td>70-80%</td><td>Dataset yang sangat besar, pengambilan kasar</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Sangat cepat</td><td>98-99%</td><td>Hanya jika latensi lebih penting daripada biaya</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>Sedang</td><td>95-98%</td><td>Skala yang sangat besar dengan SSD NVMe</td></tr>
</tbody>
</table>
<p><strong>Kesimpulannya:</strong> Beralih dari HNSW atau IVF_FLAT ke IVF_SQ8 biasanya hanya menurunkan daya ingat sebesar 2-3% (misalnya, dari 97% menjadi 94-95%) sekaligus memangkas biaya memori sekitar 70%. Untuk sebagian besar beban kerja RAG, pengorbanan tersebut sangat sepadan. Jika Anda melakukan pengambilan kasar atau bilah akurasi Anda lebih rendah, IVF_PQ atau IVF_RABITQ dapat lebih meningkatkan penghematan.</p>
<p><strong>Rekomendasi saya:</strong> Jika Anda menjalankan HNSW dalam produksi dan biaya menjadi masalah, cobalah IVF_SQ8 pada koleksi tes terlebih dahulu. Ukurlah recall pada kueri Anda yang sebenarnya. Sebagian besar tim terkejut dengan betapa kecilnya penurunan akurasi.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Berhenti Memuat Segala Sesuatu ke dalam Memori untuk Pengurangan Biaya 60%-80<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Bahkan setelah memilih indeks yang lebih efisien, Anda mungkin masih memiliki lebih banyak data dalam memori daripada yang diperlukan. Milvus menawarkan dua cara untuk mengatasi hal ini: <strong>MMap (tersedia sejak 2.3) dan penyimpanan berjenjang (tersedia sejak 2.6). Keduanya dapat mengurangi penggunaan memori sebesar 60-80%.</strong></p>
<p>Ide utama di balik keduanya adalah sama: tidak semua data Anda harus berada dalam memori setiap saat. Perbedaannya adalah bagaimana keduanya menangani data yang tidak berada di memori.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (File yang Dipetakan Memori)</h3><p>MMap memetakan file data Anda dari disk lokal ke dalam ruang alamat proses. Kumpulan data lengkap tetap berada di disk lokal simpul, dan OS memuat halaman ke dalam memori sesuai permintaan-hanya ketika diakses. Sebelum menggunakan MMap, semua data diunduh dari penyimpanan objek (S3/MinIO) ke disk lokal QueryNode.</p>
<ul>
<li>Penggunaan memori turun hingga ~10-30% dari mode beban penuh</li>
<li>Latensi tetap stabil dan dapat diprediksi (data ada di disk lokal, tidak ada pengambilan jaringan)</li>
<li>Pengorbanan: disk lokal harus cukup besar untuk menampung dataset penuh</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Penyimpanan Berjenjang</h3><p>Penyimpanan berjenjang mengambil langkah lebih jauh. Alih-alih mengunduh semuanya ke disk lokal, penyimpanan ini menggunakan disk lokal sebagai cache untuk data yang sedang aktif dan menyimpan penyimpanan objek sebagai lapisan utama. Data diambil dari penyimpanan objek hanya ketika dibutuhkan.</p>
<ul>
<li>Penggunaan memori turun hingga &lt;10% dari mode beban penuh</li>
<li>Penggunaan disk lokal juga menurun - hanya data panas yang di-cache (biasanya 10-30% dari total)</li>
<li>Pengorbanan: cache yang terlewat menambah latensi 50-200ms (pengambilan dari penyimpanan objek)</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Aliran data dan penggunaan sumber daya</h3><table>
<thead>
<tr><th><strong>Mode</strong></th><th><strong>Aliran Data</strong></th><th><strong>Penggunaan Memori</strong></th><th><strong>Penggunaan Disk Lokal</strong></th><th><strong>Latensi</strong></th></tr>
</thead>
<tbody>
<tr><td>Beban penuh tradisional</td><td>Penyimpanan objek → memori (100%)</td><td>Sangat tinggi (100%)</td><td>Rendah (hanya sementara)</td><td>Sangat rendah dan stabil</td></tr>
<tr><td>MMap</td><td>Penyimpanan objek → disk lokal (100%) → memori (sesuai permintaan)</td><td>Rendah (10-30%)</td><td>Tinggi (100%)</td><td>Rendah dan stabil</td></tr>
<tr><td>Penyimpanan berjenjang</td><td>Penyimpanan objek ↔ cache lokal (data panas) → memori (sesuai permintaan)</td><td>Sangat rendah (&lt;10%)</td><td>Rendah (hanya data panas)</td><td>Rendah pada cache hit, lebih tinggi pada cache miss</td></tr>
</tbody>
</table>
<p><strong>Rekomendasi perangkat keras:</strong> kedua metode ini sangat bergantung pada I/O disk lokal, sehingga <strong>SSD NVMe</strong> sangat disarankan, idealnya dengan <strong>IOPS di atas 10.000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap vs Penyimpanan Berjenjang: Mana yang Harus Anda Gunakan?</h3><table>
<thead>
<tr><th><strong>Situasi Anda</strong></th><th><strong>Gunakan Ini</strong></th><th><strong>Mengapa</strong></th></tr>
</thead>
<tbody>
<tr><td>Peka terhadap latensi (P99 &lt; 20ms)</td><td>MMap</td><td>Data sudah ada di disk lokal - tidak ada pengambilan jaringan, latensi stabil</td></tr>
<tr><td>Akses yang seragam (tidak ada pemisahan panas/dingin yang jelas)</td><td>MMap</td><td>Penyimpanan berjenjang membutuhkan kemiringan panas/dingin agar efektif; tanpanya, hit rate cache rendah</td></tr>
<tr><td>Biaya adalah prioritas (lonjakan latensi sesekali tidak masalah)</td><td>Penyimpanan berjenjang</td><td>Menghemat memori dan disk lokal (70-90% lebih sedikit disk)</td></tr>
<tr><td>Pola panas/dingin yang jelas (aturan 80/20)</td><td>Penyimpanan berjenjang</td><td>Data panas tetap di-cache, data dingin tetap murah dalam penyimpanan objek</td></tr>
<tr><td>Skala yang sangat besar (&gt;500 juta vektor)</td><td>Penyimpanan berjenjang</td><td>Disk lokal satu node sering kali tidak dapat menampung seluruh dataset pada skala ini</td></tr>
</tbody>
</table>
<p><strong>Catatan:</strong> MMap membutuhkan Milvus 2.3+. Penyimpanan berjenjang membutuhkan Milvus 2.6+. Keduanya bekerja paling baik dengan SSD NVMe (disarankan 10.000+ IOPS).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">Cara Mengonfigurasi MMap</h3><p><strong>Opsi 1: Konfigurasi YAML (disarankan untuk penerapan baru)</strong></p>
<p>Edit file konfigurasi Milvus milvus.yaml dan tambahkan pengaturan berikut di bawah bagian queryNode:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Opsi 2: Konfigurasi Python SDK (untuk koleksi yang sudah ada)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">Cara Mengonfigurasi Penyimpanan Berjenjang (Milvus 2.6+)</h3><p>Edit file konfigurasi Milvus milvus.yaml dan tambahkan pengaturan berikut di bawah bagian queryNode:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Gunakan Penyematan Berdimensi Lebih Rendah<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Hal ini mudah diabaikan, tetapi dimensi ini secara langsung mengurangi biaya Anda. Memori, penyimpanan, dan komputasi semuanya bertambah secara linier dengan jumlah dimensi. Model 1536 dimensi membutuhkan infrastruktur sekitar 4x lebih banyak daripada model 384 dimensi untuk data yang sama.</p>
<p>Biaya kueri juga berskala dengan cara yang sama - kemiripan kosinus adalah O(D), sehingga vektor 768-dim membutuhkan waktu sekitar dua kali lipat komputasi vektor 384-dim per kueri. Dalam beban kerja QPS tinggi, perbedaan tersebut diterjemahkan secara langsung ke dalam lebih sedikit node yang dibutuhkan.</p>
<p>Berikut adalah perbandingan model penyematan yang umum (menggunakan 384-dim sebagai dasar 1,0x):</p>
<table>
<thead>
<tr><th><strong>Model</strong></th><th><strong>Dimensi</strong></th><th><strong>Biaya Relatif</strong></th><th><strong>Ingat</strong></th><th><strong>Terbaik Untuk</strong></th></tr>
</thead>
<tbody>
<tr><td>penyematan teks-3-besar</td><td>3072</td><td>8.0x</td><td>98%+</td><td>Ketika akurasi tidak bisa ditawar (penelitian, perawatan kesehatan)</td></tr>
<tr><td>penyematan-teks-3-kecil</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>Beban kerja RAG secara umum</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Keseimbangan biaya-kinerja yang baik</td></tr>
<tr><td>semua-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Beban kerja yang sensitif terhadap biaya</td></tr>
</tbody>
</table>
<p><strong>Saran praktis:</strong> Jangan berasumsi bahwa Anda membutuhkan model yang paling besar. Uji pada sampel representatif dari kueri Anda yang sebenarnya (1 juta vektor biasanya cukup) dan temukan model dengan dimensi terendah yang memenuhi standar akurasi Anda. Banyak tim menemukan bahwa 768 dimensi bekerja sama baiknya dengan 1536 untuk kasus penggunaan mereka.</p>
<p><strong>Sudah berkomitmen dengan model dimensi tinggi?</strong> Anda dapat mengurangi dimensi setelah fakta. PCA (Principal Component Analysis) dapat menghilangkan fitur-fitur yang tidak berguna, dan penyematan <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">Matryoshka</a> memungkinkan Anda memotong hingga N dimensi pertama dengan tetap mempertahankan sebagian besar kualitasnya. Keduanya patut dicoba sebelum menyematkan kembali seluruh dataset Anda.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Kelola Siklus Hidup Data dengan Pemadatan dan TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>Yang satu ini tidak terlalu glamor namun tetap penting, terutama untuk sistem produksi yang sudah berjalan lama. Milvus menggunakan model penyimpanan append-only: ketika Anda menghapus data, data tersebut ditandai sebagai data yang telah dihapus tetapi tidak langsung dihapus. Seiring waktu, data yang mati ini terakumulasi, menghabiskan ruang penyimpanan, dan menyebabkan kueri memindai lebih banyak baris daripada yang seharusnya.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Pemadatan: Mengambil Kembali Penyimpanan dari Data yang Dihapus</h3><p>Pemadatan adalah proses latar belakang Milvus untuk membersihkan. Proses ini menggabungkan segmen-segmen kecil, menghapus data yang dihapus secara fisik, dan menulis ulang file yang dipadatkan. Anda akan membutuhkan ini jika:</p>
<ul>
<li>Anda sering menulis dan menghapus (katalog produk, pembaruan konten, log waktu nyata)</li>
<li>Jumlah segmen Anda terus bertambah (hal ini meningkatkan biaya overhead per kueri)</li>
<li>Penggunaan penyimpanan tumbuh jauh lebih cepat daripada data valid Anda yang sebenarnya</li>
</ul>
<p><strong>Peringatan:</strong> Pemadatan bersifat intensif I/O. Jadwalkan selama periode lalu lintas rendah (misalnya, malam hari) atau atur pemicunya dengan hati-hati agar tidak bersaing dengan kueri produksi.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL (Waktu untuk Hidup): Secara Otomatis Mengakhiri Data Vektor Lama</h3><p>Untuk data yang secara alami kedaluwarsa, TTL lebih bersih daripada penghapusan manual. Tetapkan masa pakai data Anda, dan Milvus secara otomatis menandainya untuk dihapus ketika masa pakainya habis. Pemadatan menangani pembersihan yang sebenarnya.</p>
<p>Ini berguna untuk:</p>
<ul>
<li>Log dan data sesi - hanya menyimpan 7 atau 30 hari terakhir</li>
<li>RAG yang peka terhadap waktu - lebih memilih pengetahuan terbaru, biarkan dokumen lama kedaluwarsa</li>
<li>Rekomendasi waktu nyata - hanya mengambil dari perilaku pengguna terkini</li>
</ul>
<p>Bersama-sama, pemadatan dan TTL menjaga sistem Anda agar tidak menumpuk sampah secara diam-diam. Ini bukan pengungkit biaya terbesar, namun mencegah jenis penyimpanan lambat yang membuat tim lengah.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">Satu Opsi Lagi: Zilliz Cloud (Milvus yang Dikelola Sepenuhnya)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengungkapan penuh: <a href="https://zilliz.com/">Zilliz Cloud</a> dibangun oleh tim yang sama di belakang Milvus, jadi terima saja ini dengan bijaksana.</p>
<p>Namun demikian, inilah bagian yang berlawanan dengan intuisi: meskipun Milvus gratis dan open source, layanan terkelola sebenarnya bisa lebih murah daripada hosting sendiri. Alasannya sederhana - perangkat lunaknya gratis, tetapi infrastruktur cloud untuk menjalankannya tidak gratis, dan Anda membutuhkan teknisi untuk mengoperasikan dan memeliharanya. Jika layanan terkelola dapat melakukan pekerjaan yang sama dengan lebih sedikit mesin dan lebih sedikit jam kerja teknisi, total tagihan Anda akan berkurang bahkan setelah membayar layanan itu sendiri.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> adalah layanan terkelola penuh yang dibangun di atas Milvus dan kompatibel dengan API. Ada dua hal yang relevan dengan biaya:</p>
<ul>
<li><strong>Performa yang lebih baik per node.</strong> Zilliz Cloud berjalan pada Cardinal, mesin pencari kami yang telah dioptimalkan. Berdasarkan <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">hasil VectorDBBench</a>, layanan ini memberikan throughput 3-5x lebih tinggi daripada Milvus sumber terbuka dan 10x lebih cepat. Dalam praktiknya, ini berarti Anda membutuhkan sekitar sepertiga hingga seperlima lebih banyak node komputasi untuk beban kerja yang sama.</li>
<li><strong>Pengoptimalan bawaan.</strong> Fitur-fitur yang tercakup dalam panduan ini - MMap, penyimpanan berjenjang, dan kuantisasi indeks - sudah terpasang dan disetel secara otomatis. Penskalaan otomatis menyesuaikan kapasitas berdasarkan beban aktual, sehingga Anda tidak membayar untuk ruang penyimpanan yang tidak Anda perlukan.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/zilliz-migration-service">Migrasi</a> sangat mudah karena API dan format datanya kompatibel. Zilliz juga menyediakan perkakas migrasi untuk membantu. Untuk perbandingan terperinci, lihat: <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Ringkasan: Rencana Langkah-demi-Langkah untuk Memangkas Biaya Basis Data Vektor<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Jika Anda hanya melakukan satu hal, lakukan ini: periksa jenis indeks Anda.</strong></p>
<p>Jika Anda menjalankan HNSW dengan beban kerja yang sensitif terhadap biaya, beralihlah ke IVF_SQ8. Hal ini dapat mengurangi biaya memori hingga ~70% dengan kehilangan pemanggilan yang minimal.</p>
<p>Jika Anda ingin melangkah lebih jauh, inilah urutan prioritasnya:</p>
<ul>
<li><strong>Ganti indeks Anda</strong> - HNSW → IVF_SQ8 untuk sebagian besar beban kerja. Perubahan arsitektur yang paling besar tanpa perubahan.</li>
<li><strong>Aktifkan MMap atau penyimpanan berjenjang</strong> - Berhenti menyimpan semuanya dalam memori. Ini adalah perubahan konfigurasi, bukan desain ulang.</li>
<li><strong>Evaluasi dimensi penyematan Anda</strong> - Uji apakah model yang lebih kecil memenuhi kebutuhan akurasi Anda. Hal ini membutuhkan penyematan ulang tetapi dengan penghematan yang lebih besar.</li>
<li><strong>Atur pemadatan dan TTL</strong> - Cegah data yang membengkak secara diam-diam, terutama jika Anda sering menulis/menghapus.</li>
</ul>
<p>Jika digabungkan, strategi ini dapat mengurangi tagihan basis data vektor Anda sebesar 60-80%. Tidak semua tim membutuhkan keempatnya - mulailah dengan perubahan indeks, ukur dampaknya, dan lanjutkan ke daftar berikutnya.</p>
<p>Untuk tim yang ingin mengurangi pekerjaan operasional dan meningkatkan efisiensi biaya, <a href="https://zilliz.com/">Zilliz Cloud</a> (Milvus yang dikelola) adalah pilihan lain.</p>
<p>Jika Anda sedang mengerjakan salah satu dari pengoptimalan ini dan ingin membandingkan catatan, <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">komunitas Milvus Slack</a> adalah tempat yang tepat untuk bertanya. Anda juga dapat bergabung dengan <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kantor Milvus</a> untuk mengobrol singkat dengan tim teknisi tentang pengaturan spesifik Anda.</p>
