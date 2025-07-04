---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >-
  Mengumumkan VDBBench 1.0: Pembandingan Basis Data Vektor Sumber Terbuka dengan
  Beban Kerja Produksi Dunia Nyata Anda
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  Temukan VDBBench 1.0, alat sumber terbuka untuk membandingkan database vektor
  dengan data dunia nyata, konsumsi streaming, dan beban kerja bersamaan.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>Sebagian besar tolok ukur basis data vektor menguji dengan data statis dan indeks yang dibuat sebelumnya. Tetapi sistem produksi tidak bekerja seperti itu-data mengalir terus menerus saat pengguna menjalankan kueri, menyaring indeks fragmen, dan karakteristik kinerja berubah secara dramatis di bawah beban baca/tulis yang bersamaan.</p>
<p>Hari ini kami merilis <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>, sebuah benchmark sumber terbuka yang dirancang dari awal untuk menguji database vektor dalam kondisi produksi yang realistis: konsumsi data streaming, pemfilteran metadata dengan selektivitas yang berbeda-beda, dan beban kerja bersamaan yang mengungkapkan kemacetan sistem yang sebenarnya.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>Unduh VDBBench 1.0 →</strong></a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>Lihat Papan Peringkat →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">Mengapa Benchmark Saat Ini Menyesatkan<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>Jujur saja-ada fenomena aneh di industri kita. Semua orang berbicara tentang "tidak menggunakan benchmark gaming", namun banyak yang berpartisipasi dalam perilaku tersebut. Sejak pasar database vektor meledak pada tahun 2023, kami telah melihat banyak contoh sistem yang "melakukan benchmark dengan baik" tetapi "gagal total" dalam produksi, membuang-buang waktu teknik dan merusak kredibilitas proyek.</p>
<p>Kami telah menyaksikan hal ini secara langsung. Sebagai contoh, Elasticsearch membanggakan kecepatan kueri tingkat milidetik, tetapi di belakang layar, dibutuhkan waktu lebih dari 20 jam hanya untuk mengoptimalkan indeksnya. Sistem produksi apa yang dapat mentolerir waktu henti seperti itu?</p>
<p>Masalahnya berasal dari tiga kelemahan mendasar:</p>
<ul>
<li><p><strong>Kumpulan data yang sudah ketinggalan zaman:</strong> Banyak benchmark yang masih mengandalkan dataset lawas seperti SIFT (128 dimensi), sedangkan dataset modern berkisar antara 768-3.072 dimensi. Karakteristik performa sistem yang beroperasi pada vektor 128D vs. 1024D+ pada dasarnya berbeda-pola akses memori, efisiensi indeks, dan kompleksitas komputasi berubah secara dramatis.</p></li>
<li><p><strong>Metrik kesombongan:</strong> Tolok ukur berfokus pada latensi rata-rata atau QPS puncak, menciptakan gambaran yang terdistorsi. Sebuah sistem dengan latensi rata-rata 10 ms tetapi latensi P99 2 detik menciptakan pengalaman pengguna yang buruk. Throughput puncak yang diukur selama 30 detik tidak memberi tahu Anda apa pun tentang kinerja yang berkelanjutan.</p></li>
<li><p><strong>Skenario yang terlalu disederhanakan:</strong> Sebagian besar benchmark menguji alur kerja dasar "menulis data, membangun indeks, kueri" - pada dasarnya pengujian tingkat "Hello World". Produksi nyata melibatkan konsumsi data secara terus menerus saat melayani kueri, pemfilteran metadata kompleks yang memecah indeks, dan operasi baca/tulis secara bersamaan yang bersaing untuk mendapatkan sumber daya.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">Apa yang Baru di VDBBench 1.0?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench tidak hanya mengulangi filosofi pembandingan yang sudah ketinggalan zaman - VDBBench membangun kembali konsep dari prinsip-prinsip dasar dengan satu keyakinan yang memandu: sebuah tolok ukur hanya berharga jika dapat memprediksi perilaku produksi yang sebenarnya.</p>
<p>Kami telah merekayasa VDBBench untuk mereplikasi kondisi dunia nyata dengan tepat di tiga dimensi penting: keaslian <strong>data, pola beban kerja, dan metodologi pengukuran kinerja</strong>.</p>
<p>Mari kita lihat lebih dekat fitur-fitur baru apa saja yang dihadirkan.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 Dasbor yang Didesain Ulang dengan Visualisasi yang Relevan dengan Produksi</strong></h3><p>Sebagian besar tolok ukur hanya berfokus pada output data mentah, tetapi yang penting adalah bagaimana para insinyur menginterpretasikan dan menindaklanjuti hasil tersebut. Kami mendesain ulang UI untuk memprioritaskan kejelasan dan interaktivitas-memungkinkan Anda menemukan kesenjangan kinerja antara sistem dan membuat keputusan infrastruktur yang cepat.</p>
<p>Dasbor baru memvisualisasikan tidak hanya angka kinerja, tetapi juga hubungan di antara keduanya: bagaimana QPS menurun di bawah tingkat selektivitas filter yang berbeda, bagaimana recall berfluktuasi selama konsumsi streaming, dan bagaimana distribusi latensi mengungkapkan karakteristik stabilitas sistem.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami telah menguji ulang platform basis data vektor utama termasuk <strong>Milvus, Zilliz Cloud, Elastic Cloud, Qdrant Cloud, Pinecone, dan OpenSearch</strong> dengan konfigurasi terbaru dan pengaturan yang direkomendasikan, memastikan semua data benchmark mencerminkan kemampuan saat ini. Semua hasil pengujian tersedia di<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> Papan Peringkat VDBBench</a>.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Pemfilteran Tag: Pembunuh Performa Tersembunyi</h3><p>Kueri dunia nyata jarang terjadi secara terpisah. Aplikasi menggabungkan kemiripan vektor dengan pemfilteran metadata ("temukan sepatu yang terlihat seperti foto ini tetapi harganya di bawah $100"). Pencarian vektor yang difilter ini menciptakan tantangan unik yang diabaikan oleh sebagian besar benchmark.</p>
<p>Pencarian yang difilter memperkenalkan kompleksitas di dua area penting:</p>
<ul>
<li><p><strong>Kompleksitas Filter</strong>: Lebih banyak bidang skalar dan kondisi logika yang kompleks meningkatkan tuntutan komputasi dan dapat menyebabkan pemanggilan yang tidak memadai dan fragmentasi indeks grafik.</p></li>
<li><p><strong>Selektivitas Filter</strong>: Ini adalah "pembunuh kinerja tersembunyi" yang telah berulang kali kami verifikasi dalam produksi. Ketika kondisi penyaringan menjadi sangat selektif (menyaring 99%+ data), kecepatan kueri dapat berfluktuasi dengan urutan besarnya, dan pemanggilan kembali dapat menjadi tidak stabil karena struktur indeks berjuang dengan set hasil yang jarang.</p></li>
</ul>
<p>VDBBench secara sistematis menguji berbagai tingkat selektivitas penyaringan (dari 50% hingga 99,9%), memberikan profil kinerja yang komprehensif di bawah pola produksi yang kritis ini. Hasilnya sering kali menunjukkan jurang performa yang dramatis yang tidak akan pernah muncul dalam tolok ukur tradisional.</p>
<p><strong>Contoh</strong>: Dalam pengujian Cohere 1M, Milvus mempertahankan recall yang tinggi secara konsisten di semua tingkat selektivitas filter, sementara OpenSearch menunjukkan kinerja yang tidak stabil dengan recall yang berfluktuasi secara signifikan dalam kondisi penyaringan yang berbeda - jatuh di bawah 0,8 recall dalam banyak kasus, yang tidak dapat diterima untuk sebagian besar lingkungan produksi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: QPS dan Recall dari Milvus dan OpenSearch pada Tingkat Selektivitas Filter yang Berbeda (Uji Cohere 1M).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 Streaming Baca/Tulis: Melampaui Pengujian Indeks Statis</h3><p>Sistem produksi jarang menikmati kemewahan data statis. Informasi baru terus mengalir saat pencarian dijalankan - sebuah skenario di mana banyak database yang mengesankan runtuh di bawah tekanan ganda untuk mempertahankan kinerja pencarian sambil menangani penulisan yang terus menerus.</p>
<p>Skenario streaming VDBBench mensimulasikan operasi paralel yang nyata, membantu pengembang memahami stabilitas sistem di lingkungan dengan konkurensi tinggi, terutama bagaimana penulisan data berdampak pada kinerja kueri dan bagaimana kinerja berkembang seiring dengan meningkatnya volume data.</p>
<p>Untuk memastikan perbandingan yang adil di berbagai sistem, VDBBench menggunakan pendekatan terstruktur:</p>
<ul>
<li><p>Mengonfigurasi laju penulisan terkontrol yang mencerminkan beban kerja produksi target (misalnya, 500 baris/detik yang didistribusikan di 5 proses paralel)</p></li>
<li><p>Memicu operasi pencarian setelah setiap 10% konsumsi data, bergantian antara mode serial dan bersamaan</p></li>
<li><p>Mencatat metrik yang komprehensif: distribusi latensi (termasuk P99), QPS yang berkelanjutan, dan akurasi pemanggilan</p></li>
<li><p>Melacak evolusi kinerja dari waktu ke waktu seiring dengan meningkatnya volume data dan tekanan sistem</p></li>
</ul>
<p>Pengujian beban tambahan yang terkendali ini mengungkapkan seberapa baik sistem mempertahankan stabilitas dan akurasi di bawah konsumsi data yang sedang berlangsung-sesuatu yang jarang ditangkap oleh tolok ukur tradisional.</p>
<p><strong>Contoh</strong>: Dalam pengujian streaming Cohere 10M, Pinecone mempertahankan QPS dan recall yang lebih tinggi selama siklus penulisan dibandingkan dengan Elasticsearch. Khususnya, kinerja Pinecone meningkat secara signifikan setelah konsumsi selesai, menunjukkan stabilitas yang kuat di bawah beban yang berkelanjutan, sementara Elasticsearch menunjukkan perilaku yang lebih tidak menentu selama fase konsumsi aktif.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: QPS dan Recall Pinecone vs Elasticsearch dalam Uji Streaming Cohere 10M (Laju Konsumsi 500 baris/s).</p>
<p>VDBBench melangkah lebih jauh dengan mendukung langkah pengoptimalan opsional, yang memungkinkan pengguna untuk membandingkan kinerja pencarian streaming sebelum dan sesudah pengoptimalan indeks. VDBBench juga melacak dan melaporkan waktu aktual yang dihabiskan untuk setiap tahap, menawarkan wawasan yang lebih dalam tentang efisiensi dan perilaku sistem dalam kondisi seperti produksi.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: QPS dan Recall Pinecone vs Elasticsearch dalam Tes Streaming Cohere 10M Setelah Pengoptimalan (Laju Konsumsi 500 baris/s)</em></p>
<p>Seperti yang ditunjukkan dalam pengujian kami, Elasticsearch mengungguli Pinecone dalam QPS-setelah pengoptimalan indeks. Namun, ketika sumbu x mencerminkan waktu yang telah berlalu secara aktual, terlihat jelas bahwa Elasticsearch membutuhkan waktu yang jauh lebih lama untuk mencapai performa tersebut. Dalam produksi, penundaan itu penting. Perbandingan ini menunjukkan pertukaran utama: throughput puncak vs. waktu untuk melayani.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">🔬 Dataset Modern yang Mencerminkan Beban Kerja AI Saat Ini</h3><p>Kami telah merombak total dataset yang digunakan untuk pembandingan basis data vektor. Alih-alih menggunakan set pengujian lawas seperti SIFT dan GloVe, VDBBench menggunakan vektor yang dihasilkan dari model penyematan mutakhir seperti OpenAI dan Cohere yang mendukung aplikasi AI saat ini.</p>
<p>Untuk memastikan relevansi, terutama untuk kasus penggunaan seperti Retrieval-Augmented Generation (RAG), kami memilih korpus yang mencerminkan perusahaan dunia nyata dan skenario khusus domain:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Korpus</strong></td><td><strong>Model Penyematan</strong></td><td><strong>Dimensi</strong></td><td><strong>Ukuran</strong></td><td><strong>Kasus Penggunaan</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>Basis pengetahuan umum</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>Spesifik domain (biomedis)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500 RIBU / 5 JUTA</td><td>Pemrosesan teks skala web</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td><td>Pencarian skala besar</td></tr>
</tbody>
</table>
<p>Dataset ini mensimulasikan data vektor bervolume tinggi dan berdimensi tinggi saat ini dengan lebih baik, sehingga memungkinkan pengujian realistis atas efisiensi penyimpanan, kinerja kueri, dan akurasi pencarian dalam kondisi yang sesuai dengan beban kerja AI modern.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ Dukungan Dataset Khusus untuk Pengujian Khusus Industri</h3><p>Setiap bisnis itu unik. Industri keuangan mungkin membutuhkan pengujian yang berfokus pada penyematan transaksi, sementara platform sosial lebih peduli dengan vektor perilaku pengguna. VDBBench memungkinkan Anda melakukan benchmark dengan data Anda sendiri yang dihasilkan dari model penyematan spesifik untuk beban kerja spesifik Anda.</p>
<p>Anda dapat menyesuaikan:</p>
<ul>
<li><p>Dimensi vektor dan tipe data</p></li>
<li><p>Skema metadata dan pola pemfilteran</p></li>
<li><p>Volume data dan pola konsumsi</p></li>
<li><p>Distribusi kueri yang sesuai dengan lalu lintas produksi Anda</p></li>
</ul>
<p>Lagi pula, tidak ada set data yang menceritakan kisah yang lebih baik daripada data produksi Anda sendiri.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">Bagaimana VDBBench Mengukur Apa yang Sebenarnya Penting dalam Produksi<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Desain Metrik yang Berfokus pada Produksi</h3><p>VDBBench memprioritaskan metrik yang mencerminkan kinerja dunia nyata, bukan hanya hasil lab. Kami telah mendesain ulang pembandingan seputar hal yang benar-benar penting dalam lingkungan produksi: <strong>keandalan di bawah beban, karakteristik latensi ekor, throughput yang berkelanjutan, dan pelestarian akurasi</strong>.</p>
<ul>
<li><p><strong>Latensi P95/P99 untuk Pengalaman Pengguna Nyata</strong>: Latensi rata-rata/median menyembunyikan outlier yang membuat frustrasi pengguna nyata dan dapat mengindikasikan ketidakstabilan sistem yang mendasarinya. VDBBench berfokus pada latensi ekor seperti P95/P99, yang mengungkapkan kinerja apa yang sebenarnya akan dicapai oleh 95% atau 99% dari permintaan Anda. Hal ini sangat penting untuk perencanaan SLA dan memahami pengalaman pengguna dalam kondisi terburuk.</p></li>
<li><p><strong>Throughput Berkelanjutan di Bawah Beban</strong>: Sistem yang berkinerja baik selama 5 detik tidak cukup untuk produksi. VDBBench secara bertahap meningkatkan konkurensi untuk menemukan kueri berkelanjutan maksimum basis data Anda per detik (<code translate="no">max_qps</code>) - bukan angka puncak dalam kondisi yang singkat dan ideal. Metodologi ini mengungkapkan seberapa baik sistem Anda bertahan dari waktu ke waktu dan membantu perencanaan kapasitas yang realistis.</p></li>
<li><p><strong>Daya Ingat Seimbang dengan Kinerja</strong>: Kecepatan tanpa akurasi tidak ada artinya. Setiap angka performa di VDBBench dipasangkan dengan pengukuran recall, sehingga Anda tahu persis seberapa besar relevansi yang Anda tukar dengan throughput. Hal ini memungkinkan perbandingan yang adil dan setara antara sistem dengan pengorbanan internal yang sangat berbeda.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodologi Pengujian yang Mencerminkan Realitas</h3><p>Inovasi utama dalam desain VDBBench adalah pemisahan pengujian serial dan pengujian bersamaan, yang membantu menangkap bagaimana sistem berperilaku di bawah berbagai jenis beban dan mengungkapkan karakteristik kinerja yang penting untuk berbagai kasus penggunaan.</p>
<p><strong>Pemisahan Pengukuran Latensi:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> mengukur kinerja sistem di bawah beban minimal, di mana hanya satu permintaan yang diproses dalam satu waktu. Ini merupakan skenario kasus terbaik untuk latensi dan membantu mengidentifikasi kemampuan sistem dasar.</p></li>
<li><p><code translate="no">conc_latency_p99</code> menangkap perilaku sistem di bawah kondisi konkurensi tinggi yang realistis, di mana banyak permintaan datang secara bersamaan dan bersaing untuk mendapatkan sumber daya sistem.</p></li>
</ul>
<p><strong>Struktur Tolok Ukur Dua Fase</strong>:</p>
<ol>
<li><p><strong>Uji Serial</strong>: Proses tunggal yang terdiri dari 1.000 kueri yang menetapkan kinerja dan akurasi dasar, melaporkan <code translate="no">serial_latency_p99</code> dan recall. Fase ini membantu mengidentifikasi batas tertinggi kinerja teoretis.</p></li>
<li><p><strong>Uji Konkurensi</strong>: Mensimulasikan lingkungan produksi di bawah beban yang berkelanjutan dengan beberapa inovasi utama:</p>
<ul>
<li><p><strong>Simulasi klien yang realistis</strong>: Setiap proses pengujian beroperasi secara independen dengan koneksi dan kumpulan kueri sendiri, menghindari gangguan status bersama yang dapat mendistorsi hasil</p></li>
<li><p><strong>Awal yang disinkronkan</strong>: Semua proses dimulai secara bersamaan, memastikan QPS yang diukur secara akurat mencerminkan tingkat konkurensi yang diklaim</p></li>
<li><p><strong>Kumpulan kueri independen</strong>: Mencegah tingkat hit cache yang tidak realistis yang tidak mencerminkan keragaman kueri produksi</p></li>
</ul></li>
</ol>
<p>Metode yang terstruktur dengan cermat ini memastikan bahwa nilai <code translate="no">max_qps</code> dan <code translate="no">conc_latency_p99</code> yang dilaporkan oleh VDBBench akurat dan relevan dengan produksi, sehingga memberikan wawasan yang berarti untuk perencanaan kapasitas produksi dan desain sistem.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">Memulai dengan VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong> mewakili perubahan mendasar menuju pembandingan yang relevan dengan produksi. Dengan mencakup penulisan data yang berkelanjutan, penyaringan metadata dengan berbagai selektivitas, dan beban streaming di bawah pola akses bersamaan, VDBBench 1.0 memberikan perkiraan yang paling mendekati lingkungan produksi aktual yang tersedia saat ini.</p>
<p>Kesenjangan antara hasil benchmark dan kinerja dunia nyata seharusnya tidak perlu ditebak-tebak. Jika Anda berencana menerapkan database vektor dalam produksi, ada baiknya Anda memahami bagaimana kinerjanya di luar pengujian laboratorium yang ideal. VDBBench adalah sumber terbuka, transparan, dan dirancang untuk mendukung perbandingan yang bermakna, apple-to-apple.</p>
<p>Jangan terpengaruh oleh angka-angka yang mengesankan yang tidak diterjemahkan ke dalam nilai produksi. <strong>Gunakan VDBBench 1.0 untuk menguji skenario yang penting bagi bisnis Anda, dengan data Anda, dalam kondisi yang mencerminkan beban kerja Anda yang sebenarnya.</strong> Era tolok ukur yang menyesatkan dalam evaluasi basis data vektor telah berakhir-saatnya membuat keputusan berdasarkan data yang relevan dengan produksi.</p>
<p><strong>Cobalah VDBBench dengan beban kerja Anda sendiri:</strong><a href="https://github.com/zilliztech/VectorDBBench"> https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>Melihat hasil pengujian database vektor utama:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> Papan Peringkat VDBBench</a></p>
<p>Ada pertanyaan atau ingin membagikan hasil pengujian Anda? Bergabunglah dengan percakapan di<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> atau terhubung dengan komunitas kami di<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
