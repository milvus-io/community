---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: >-
  Memperkenalkan Milvus 2.6: Pencarian Vektor yang Terjangkau dalam Skala
  Miliaran
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Kami dengan senang hati mengumumkan bahwa Milvus 2.6 kini telah tersedia.
  Rilis ini memperkenalkan lusinan fitur yang secara langsung menangani
  tantangan paling mendesak dalam pencarian vektor saat ini - penskalaan secara
  efisien sambil menjaga biaya tetap terkendali.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>Seiring dengan berkembangnya pencarian yang didukung AI dari proyek eksperimental menjadi infrastruktur yang sangat penting, tuntutan terhadap <a href="https://milvus.io/blog/what-is-a-vector-database.md">basis data vektor</a> semakin meningkat. Organisasi perlu menangani miliaran vektor sembari mengelola biaya infrastruktur, mendukung konsumsi data secara real-time, dan menyediakan pencarian yang canggih di luar <a href="https://zilliz.com/learn/vector-similarity-search">pencarian kemiripan</a> dasar. Untuk mengatasi tantangan yang terus berkembang ini, kami telah bekerja keras mengembangkan dan menyempurnakan Milvus. Tanggapan komunitas sangat menggembirakan, dengan umpan balik yang berharga yang membantu menentukan arah kami.</p>
<p>Setelah berbulan-bulan melakukan pengembangan intensif, kami dengan senang hati mengumumkan bahwa <strong>Milvus 2.6 kini telah tersedia</strong>. Rilis ini secara langsung menjawab tantangan yang paling mendesak dalam pencarian vektor saat ini: penskalaan <strong><em>yang efisien sambil menjaga biaya tetap terkendali</em></strong>.</p>
<p>Milvus 2.6 memberikan inovasi terobosan di tiga area penting: <strong>pengurangan biaya, kemampuan pencarian tingkat lanjut, dan peningkatan arsitektur untuk skala besar</strong>. Hasilnya berbicara sendiri:</p>
<ul>
<li><p><strong>Pengurangan memori 72%</strong> dengan kuantisasi RaBitQ 1-bit sekaligus memberikan kueri 4x lebih cepat</p></li>
<li><p><strong>Penghematan biaya 50%</strong> melalui penyimpanan berjenjang yang cerdas</p></li>
<li><p><strong>Pencarian teks lengkap 4x lebih cepat</strong> daripada Elasticsearch dengan implementasi BM25 kami yang telah disempurnakan</p></li>
<li><p>Pemfilteran JSON<strong>100x lebih cepat</strong> dengan Path Index yang baru diperkenalkan</p></li>
<li><p><strong>Kesegaran pencarian dicapai secara ekonomis</strong> dengan arsitektur tanpa disk yang baru</p></li>
<li><p><strong>Alur kerja penyematan yang disederhanakan</strong> dengan pengalaman "data masuk dan data keluar" yang baru</p></li>
<li><p><strong>Hingga 100 ribu koleksi dalam satu klaster</strong> untuk multi-tenancy yang tahan masa depan</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">Inovasi untuk Pengurangan Biaya: Membuat Pencarian Vektor Menjadi Terjangkau<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>Konsumsi memori menjadi salah satu tantangan terbesar ketika meningkatkan skala pencarian vektor ke miliaran record. Milvus 2.6 memperkenalkan beberapa optimasi utama yang secara signifikan mengurangi biaya infrastruktur Anda sekaligus meningkatkan kinerja.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">Kuantisasi 1-bit RaBitQ: Pengurangan Memori 72% dengan Performa 4× lipat</h3><p>Metode kuantisasi tradisional memaksa Anda untuk menukar kualitas pencarian dengan penghematan memori. Milvus 2.6 mengubah hal ini dengan <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">kuantisasi RaBitQ 1-bit</a> yang dikombinasikan dengan mekanisme penyempurnaan yang cerdas.</p>
<p>Indeks IVF_RABITQ yang baru memampatkan indeks utama menjadi 1/32 dari ukuran aslinya melalui kuantisasi 1-bit. Ketika digunakan bersama dengan penyempurnaan SQ8 opsional, pendekatan ini mempertahankan kualitas pencarian yang tinggi (95% recall) dengan hanya menggunakan 1/4 dari jejak memori asli.</p>
<p>Tolok ukur awal kami menunjukkan hasil yang menjanjikan:</p>
<table>
<thead>
<tr><th><strong>Metrik Kinerja</strong></th><th><strong>IVF_FLAT tradisional</strong></th><th><strong>Hanya RaBitQ (1-bit)</strong></th><th><strong>RaBitQ (1-bit) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>Jejak Memori</td><td>100% (garis dasar)</td><td>3% (pengurangan 97%)</td><td>28% (pengurangan 72%)</td></tr>
<tr><td>Memanggil kembali</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Throughput Pencarian (QPS)</td><td>236</td><td>648 (2,7 kali lebih cepat)</td><td>946 (4 kali lebih cepat)</td></tr>
</tbody>
</table>
<p><em>Tabel: Evaluasi VectorDBBench dengan 1M vektor berdimensi 768, diuji pada AWS m6id.2xlarge</em></p>
<p>Terobosan nyata di sini bukan hanya pengurangan memori sebesar 72%, tetapi mencapai hal ini sekaligus memberikan peningkatan throughput 4× lipat. Ini berarti Anda dapat melayani beban kerja yang sama dengan 75% lebih sedikit server atau menangani lalu lintas 4× lebih banyak pada infrastruktur yang ada, semuanya tanpa mengorbankan pemanggilan kembali.</p>
<p>Untuk pengguna perusahaan yang menggunakan Milvus yang dikelola sepenuhnya di<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, kami mengembangkan strategi otomatis yang secara dinamis menyesuaikan parameter RaBitQ berdasarkan karakteristik beban kerja dan persyaratan presisi Anda. Anda akan menikmati efektivitas biaya yang lebih besar di semua jenis Zilliz Cloud CU.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">Penyimpanan Berjenjang Panas-Dingin: Pengurangan Biaya 50% Melalui Penempatan Data yang Cerdas</h3><p>Beban kerja pencarian vektor di dunia nyata berisi data dengan pola akses yang sangat berbeda. Data yang sering diakses membutuhkan ketersediaan instan, sementara data arsip dapat mentolerir latensi yang sedikit lebih tinggi dengan imbalan biaya penyimpanan yang jauh lebih rendah.</p>
<p>Milvus 2.6 memperkenalkan arsitektur penyimpanan berjenjang yang secara otomatis mengklasifikasikan data berdasarkan pola akses dan menempatkannya di tingkat penyimpanan yang sesuai:</p>
<ul>
<li><p><strong>Klasifikasi data yang cerdas</strong>: Milvus secara otomatis mengidentifikasi segmen data yang panas (sering diakses) dan dingin (jarang diakses) berdasarkan pola akses</p></li>
<li><p><strong>Penempatan penyimpanan yang dioptimalkan</strong>: Data panas tetap berada di memori/SSD berkinerja tinggi, sementara data dingin berpindah ke penyimpanan objek yang lebih ekonomis</p></li>
<li><p><strong>Pergerakan data yang dinamis</strong>: Saat pola penggunaan berubah, data secara otomatis berpindah di antara tingkatan</p></li>
<li><p><strong>Pengambilan yang transparan</strong>: Saat kueri menyentuh data dingin, data tersebut secara otomatis dimuat sesuai permintaan</p></li>
</ul>
<p>Hasilnya adalah pengurangan biaya penyimpanan hingga 50% dengan tetap mempertahankan kinerja kueri untuk data aktif.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">Pengoptimalan Biaya Tambahan</h3><p>Milvus 2.6 juga memperkenalkan dukungan vektor Int8 untuk indeks HNSW, format Storage v2 untuk struktur yang dioptimalkan yang mengurangi IOPS dan kebutuhan memori, dan pemasangan yang lebih mudah secara langsung melalui manajer paket APT/YUM.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">Kemampuan Pencarian Tingkat Lanjut: Lebih dari Kesamaan Vektor Dasar<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian vektor saja tidak cukup untuk aplikasi AI modern. Pengguna menuntut ketepatan pencarian informasi tradisional yang dikombinasikan dengan pemahaman semantik dari penyematan vektor. Milvus 2.6 memperkenalkan serangkaian fitur pencarian canggih yang menjembatani kesenjangan ini.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">BM25 dengan Turbocharged: Pencarian Teks Penuh 400% Lebih Cepat Daripada Elasticsearch</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">Pencarian teks lengkap</a> telah menjadi sangat penting untuk membangun sistem pencarian hibrida dalam basis data vektor. Dalam Milvus 2.6, peningkatan kinerja yang signifikan telah dilakukan pada pencarian teks lengkap, yang dibangun di atas implementasi BM25 yang diperkenalkan sejak versi 2.5. Sebagai contoh, rilis ini memperkenalkan parameter baru seperti <code translate="no">drop_ratio_search</code> dan <code translate="no">dim_max_score_ratio</code>, meningkatkan presisi dan penyetelan kecepatan dan menawarkan kontrol pencarian yang lebih halus.</p>
<p>Tolok ukur kami terhadap dataset BEIR standar industri menunjukkan bahwa Milvus 2.6 mencapai throughput 3-4 kali lebih tinggi daripada Elasticsearch dengan tingkat recall yang setara. Untuk beban kerja tertentu, peningkatannya mencapai QPS 7× lebih tinggi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">Indeks Jalur JSON: Pemfilteran 100x Lebih Cepat</h3><p>Milvus telah mendukung tipe data JSON untuk waktu yang lama, tetapi pemfilteran pada bidang JSON lambat karena kurangnya dukungan indeks. Milvus 2.6 menambahkan dukungan untuk indeks jalur JSON untuk meningkatkan kinerja secara signifikan.</p>
<p>Pertimbangkan database profil pengguna di mana setiap catatan berisi metadata bersarang seperti:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Untuk pencarian semantik "pengguna yang tertarik dengan AI" yang hanya mencakup San Francisco, Milvus biasanya mengurai dan mengevaluasi seluruh objek JSON untuk setiap record, membuat kueri menjadi sangat mahal dan lambat.</p>
<p>Sekarang, Milvus memungkinkan Anda untuk membuat indeks pada jalur tertentu di dalam bidang JSON untuk mempercepat pencarian:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>Dalam pengujian kinerja kami dengan 100 juta lebih record, JSON Path Index mengurangi latensi filter dari <strong>140 ms</strong> (P99: 480 ms) menjadi hanya <strong>1,5 ms</strong> (P99: 10 ms) - pengurangan latensi 99% yang membuat pencarian tersebut praktis dalam produksi.</p>
<p>Fitur ini khususnya sangat berharga untuk:</p>
<ul>
<li><p>Sistem rekomendasi dengan pemfilteran atribut pengguna yang kompleks</p></li>
<li><p>Aplikasi RAG yang memfilter dokumen berdasarkan metadata</p></li>
<li><p>Sistem multi-penyewa di mana segmentasi data sangat penting</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">Pemrosesan Teks yang Disempurnakan dan Pencarian Sadar Waktu</h3><p>Milvus 2.6 memperkenalkan pipeline analisis teks yang telah dirubah sepenuhnya dengan penanganan bahasa yang canggih, termasuk tokenizer Lindera untuk bahasa Jepang dan Korea, tokenizer ICU untuk dukungan multibahasa yang komprehensif, dan Jieba yang disempurnakan dengan integrasi kamus khusus.</p>
<p><strong>Kecerdasan Pencocokan Frasa</strong> menangkap nuansa semantik dalam urutan kata, membedakan antara &quot;teknik pembelajaran mesin&quot; dan &quot;teknik mesin pembelajaran&quot;:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fungsi Peluruhan Sadar Waktu</strong> secara otomatis memprioritaskan konten baru dengan menyesuaikan nilai relevansi berdasarkan usia dokumen, dengan tingkat peluruhan yang dapat dikonfigurasi dan jenis fungsi (eksponensial, Gaussian, atau linier).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">Pencarian yang disederhanakan: Pengalaman Data Masuk, Data Keluar</h3><p>Keterputusan antara data mentah dan penyematan vektor adalah titik kesulitan lain bagi para pengembang yang menggunakan basis data vektor. Sebelum data mencapai Milvus untuk pengindeksan dan pencarian vektor, data tersebut sering kali mengalami prapemrosesan menggunakan model eksternal yang mengubah teks mentah, gambar, atau audio menjadi representasi vektor. Setelah pengambilan, pemrosesan hilir tambahan juga diperlukan, seperti pemetaan ID hasil kembali ke konten asli.</p>
<p>Milvus 2.6 menyederhanakan alur kerja penyematan ini dengan antarmuka <strong>Fungsi</strong> baru yang mengintegrasikan model penyematan pihak ketiga secara langsung ke dalam pipeline penelusuran Anda. Alih-alih melakukan penyematan pra-komputasi, Anda sekarang dapat</p>
<ol>
<li><p><strong>Menyisipkan data mentah secara langsung</strong>: Mengirimkan teks, gambar, atau konten lain ke Milvus</p></li>
<li><p><strong>Mengonfigurasi penyedia penyematan</strong>: Terhubung ke layanan API penyematan dari OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face, dan lainnya.</p></li>
<li><p><strong>Kueri menggunakan bahasa alami</strong>: Cari menggunakan kueri teks mentah secara langsung</p></li>
</ol>
<p>Hal ini menciptakan pengalaman "Data-In, Data-Out" di mana Milvus menyederhanakan semua transformasi vektor di belakang layar untuk Anda.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">Evolusi Arsitektur: Penskalaan ke Puluhan Miliar Vektor<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 memperkenalkan inovasi arsitektur mendasar yang memungkinkan penskalaan hemat biaya hingga puluhan miliar vektor.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">Mengganti Kafka dan Pulsar dengan WAL Pelatuk Baru</h3><p>Penerapan Milvus sebelumnya mengandalkan antrean pesan eksternal, seperti Kafka atau Pulsar, sebagai sistem Write-Ahead Log (WAL). Meskipun sistem ini pada awalnya bekerja dengan baik, namun sistem ini menimbulkan kompleksitas operasional dan sumber daya yang signifikan.</p>
<p>Milvus 2.6 memperkenalkan <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a>, sebuah sistem WAL yang dibuat khusus untuk cloud yang menghilangkan ketergantungan eksternal ini melalui desain zero-disk yang revolusioner:</p>
<ul>
<li><p><strong>Semuanya ada di penyimpanan objek</strong>: Semua data log disimpan di penyimpanan objek seperti S3, Google Cloud Storage, atau MinIO</p></li>
<li><p><strong>Metadata terdistribusi</strong>: Metadata masih dikelola oleh penyimpanan nilai kunci etcd</p></li>
<li><p><strong>Tidak ada ketergantungan disk lokal</strong>: Pilihan untuk menghilangkan arsitektur yang kompleks dan overhead operasional yang terlibat dalam status permanen lokal terdistribusi.</p></li>
</ul>
<p>Kami menjalankan tolok ukur komprehensif yang membandingkan kinerja Woodpecker:</p>
<table>
<thead>
<tr><th><strong>Sistem</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Lokal</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Throughput</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latensi</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Woodpecker secara konsisten mencapai 60-80% dari throughput maksimum teoretis untuk setiap backend penyimpanan, dengan mode sistem file lokal mencapai 450 MB/s - 3,5 kali lebih cepat daripada Kafka - dan mode S3 mencapai 750 MB/s, 5,8 kali lebih tinggi daripada Kafka.</p>
<p>Untuk detail lebih lanjut tentang Woodpecker, lihat blog ini: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Woodpecker untuk Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">Kesegaran Pencarian Dicapai Secara Ekonomis</h3><p>Pencarian yang sangat penting biasanya membutuhkan data yang baru saja dimasukkan agar dapat langsung dicari. Milvus 2.6 menggantikan ketergantungan antrean pesan untuk secara fundamental meningkatkan penanganan pembaruan baru dan memberikan kesegaran pencarian dengan biaya sumber daya yang lebih rendah. Arsitektur baru ini menambahkan <strong>Streaming Node</strong> baru, sebuah komponen khusus yang bekerja dalam koordinasi yang erat dengan komponen Milvus lainnya seperti Query Node dan Data Node. Streaming Node dibangun di atas Woodpecker, sistem Write-Ahead Log (WAL) kami yang ringan dan asli cloud.</p>
<p>Komponen baru ini memungkinkan:</p>
<ul>
<li><p><strong>Kompatibilitas</strong> yang<strong>luar biasa</strong>: Dapat digunakan dengan WAL Woodpecker yang baru dan kompatibel dengan Kafka, Pulsar, dan platform streaming lainnya</p></li>
<li><p><strong>Pengindeksan tambahan</strong>: Data baru dapat langsung dicari, tanpa penundaan batch</p></li>
<li><p><strong>Penyajian kueri yang berkelanjutan</strong>: Konsumsi throughput tinggi secara simultan dan kueri latensi rendah</p></li>
</ul>
<p>Dengan mengisolasi streaming dari pemrosesan batch, Streaming Node membantu Milvus mempertahankan kinerja yang stabil dan kesegaran pencarian bahkan selama konsumsi data bervolume tinggi. Node ini dirancang dengan mempertimbangkan skalabilitas horizontal, yang secara dinamis menskalakan kapasitas node berdasarkan throughput data.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">Kemampuan Multi-tenancy yang Ditingkatkan: Penskalaan hingga 100 ribu Koleksi Per Cluster</h3><p>Penerapan perusahaan sering kali membutuhkan isolasi tingkat penyewa. Milvus 2.6 secara dramatis meningkatkan dukungan multi-tenancy dengan memungkinkan hingga <strong>100.000 koleksi</strong> per cluster. Ini adalah peningkatan penting bagi organisasi yang menjalankan cluster besar monolitik yang melayani banyak penyewa.</p>
<p>Peningkatan ini dimungkinkan oleh berbagai optimasi teknik pada manajemen metadata, alokasi sumber daya, dan perencanaan kueri. Pengguna Milvus sekarang dapat menikmati kinerja yang stabil bahkan dengan puluhan ribu koleksi.</p>
<h3 id="Other-Improvements" class="common-anchor-header">Peningkatan Lainnya</h3><p>Milvus 2.6 menawarkan lebih banyak peningkatan arsitektur, seperti CDC + BulkInsert untuk replikasi data yang disederhanakan di seluruh wilayah geografis dan Coord Merge untuk koordinasi klaster yang lebih baik dalam penerapan skala besar.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Memulai dengan Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 merupakan upaya rekayasa besar-besaran dengan lusinan fitur baru dan pengoptimalan kinerja, yang dikembangkan secara kolaboratif oleh para insinyur Zilliz dan kontributor komunitas kami yang luar biasa. Meskipun kami telah membahas fitur-fitur utama di sini, masih banyak lagi yang bisa ditemukan. Kami sangat menyarankan Anda untuk membaca <a href="https://milvus.io/docs/release_notes.md">catatan rilis</a> kami yang komprehensif untuk menjelajahi semua yang ditawarkan oleh rilis ini!</p>
<p>Dokumentasi lengkap, panduan migrasi, dan tutorial tersedia di<a href="https://milvus.io/"> situs web Milvus</a>. Untuk pertanyaan dan dukungan komunitas, bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan masalah di<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
