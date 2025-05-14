---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: Tolok Ukur Bohong - DB Vektor Layak untuk Diuji Secara Nyata
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  Temukan kesenjangan performa dalam database vektor dengan VDBBench. Alat kami
  menguji di bawah skenario produksi nyata, memastikan aplikasi AI Anda berjalan
  dengan lancar tanpa waktu henti yang tak terduga.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">Basis Data Vektor yang Anda Pilih Berdasarkan Tolok Ukur Mungkin Gagal dalam Produksi<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika memilih <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vektor</a> untuk aplikasi AI Anda, tolok ukur konvensional seperti mengemudikan mobil sport di lintasan kosong, hanya untuk mendapati mobil tersebut macet di jam-jam sibuk. Kebenaran yang tidak nyaman? Sebagian besar tolok ukur hanya mengevaluasi kinerja dalam kondisi buatan yang tidak pernah ada di lingkungan produksi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebagian besar benchmark menguji database vektor <strong>setelah</strong> semua data dicerna dan indeks dibangun sepenuhnya. Namun dalam produksi, data tidak pernah berhenti mengalir. Anda tidak dapat menghentikan sistem Anda selama berjam-jam hanya untuk membangun ulang indeks.</p>
<p>Kami telah melihat langsung pemutusan hubungan tersebut. Sebagai contoh, Elasticsearch mungkin membanggakan kecepatan kueri tingkat milidetik, tetapi di balik layar, kami telah menyaksikannya membutuhkan waktu <strong>lebih dari 20 jam</strong> hanya untuk mengoptimalkan indeksnya. Itu adalah waktu henti yang tidak dapat ditoleransi oleh sistem produksi, terutama dalam beban kerja AI yang menuntut pembaruan terus menerus dan respons instan.</p>
<p>Di Milvus, setelah melakukan evaluasi Proof of Concept (PoC) yang tak terhitung jumlahnya dengan klien perusahaan, kami menemukan pola yang mengganggu: <strong>database vektor yang unggul di lingkungan lab yang terkendali sering kali kesulitan di bawah beban produksi yang sebenarnya.</strong> Kesenjangan kritis ini tidak hanya membuat para insinyur infrastruktur frustasi, tetapi juga dapat menggagalkan seluruh inisiatif AI yang dibangun di atas janji-janji kinerja yang menyesatkan ini.</p>
<p>Itulah mengapa kami membangun <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>: benchmark sumber terbuka yang dirancang dari awal untuk mensimulasikan realitas produksi. Tidak seperti pengujian sintetis yang memilih skenario, VDBBench mendorong basis data melalui konsumsi terus menerus, kondisi penyaringan yang ketat, dan skenario yang beragam, seperti beban kerja produksi Anda yang sebenarnya. Misi kami sederhana: memberikan alat bantu kepada teknisi yang menunjukkan bagaimana kinerja database vektor dalam kondisi dunia nyata sehingga Anda dapat membuat keputusan infrastruktur berdasarkan angka yang dapat dipercaya.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">Kesenjangan antara Tolok Ukur dan Kenyataan<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>Pendekatan pembandingan tradisional memiliki tiga kelemahan kritis yang membuat hasilnya tidak berarti bagi pengambilan keputusan produksi:</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. Data yang sudah ketinggalan zaman</h3><p>Banyak tolok ukur yang masih mengandalkan set data yang sudah ketinggalan zaman seperti SIFT atau<a href="https://zilliz.com/glossary/glove"> GloVe</a>, yang tidak memiliki kemiripan dengan penyematan vektor berdimensi tinggi yang kompleks saat ini yang dihasilkan oleh model AI. Pertimbangkan ini: SIFT berisi vektor 128 dimensi, sedangkan embedding populer dari model embedding OpenAI berkisar antara 768 hingga 3072 dimensi.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. Metrik Kesombongan</h3><p>Banyak tolok ukur yang hanya berfokus pada latensi rata-rata atau QPS puncak, yang menciptakan gambaran yang menyimpang. Metrik yang diidealkan ini gagal untuk menangkap outlier dan ketidakkonsistenan yang dialami pengguna sebenarnya di lingkungan produksi. Sebagai contoh, apa gunanya angka QPS yang mengesankan jika membutuhkan sumber daya komputasi tak terbatas yang akan membangkrutkan organisasi Anda?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. Skenario yang Terlalu Sederhana</h3><p>Sebagian besar benchmark hanya menguji beban kerja dasar dan statis - pada dasarnya adalah "Hello World" dari pencarian vektor. Sebagai contoh, mereka mengeluarkan permintaan pencarian hanya setelah seluruh dataset dicerna dan diindeks, mengabaikan realitas dinamis di mana pengguna melakukan pencarian saat data baru masuk. Desain sederhana ini mengabaikan pola kompleks yang mendefinisikan sistem produksi nyata seperti kueri bersamaan, pencarian yang difilter, dan konsumsi data yang terus menerus.</p>
<p>Menyadari kekurangan ini, kami menyadari bahwa industri ini membutuhkan <strong>perubahan radikal dalam filosofi pembandingan</strong>- yang didasarkan pada bagaimana sistem AI berperilaku di alam liar. Itulah mengapa kami membangun <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">Dari Lab ke Produksi: Bagaimana VDBBench Menjembatani Kesenjangan<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench tidak hanya mengulang filosofi pembandingan yang sudah ketinggalan zaman - VDBBench membangun kembali konsep ini dari prinsip-prinsip dasar dengan satu keyakinan yang memandu: <strong>sebuah</strong> pembandingan <strong>hanya berharga jika dapat memprediksi perilaku produksi yang sebenarnya</strong>.</p>
<p>Kami telah merekayasa VDBBench untuk mereplikasi kondisi dunia nyata dengan tepat di tiga dimensi penting: keaslian data, pola beban kerja, dan pengukuran kinerja.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">Memodernisasi Dataset</h3><p>Kami telah merombak total dataset yang digunakan untuk benchmarking VDBBench. Alih-alih menggunakan set pengujian lawas seperti SIFT dan GloVe, VDBBench menggunakan vektor yang dihasilkan dari model penyematan mutakhir yang mendukung aplikasi AI saat ini.</p>
<p>Untuk memastikan relevansi, terutama untuk kasus penggunaan seperti Retrieval-Augmented Generation (RAG), kami memilih korpora yang mencerminkan perusahaan dunia nyata dan skenario spesifik domain. Mulai dari basis pengetahuan untuk keperluan umum hingga aplikasi vertikal seperti menjawab pertanyaan biomedis dan pencarian web berskala besar.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Korpus</strong></td><td><strong>Model Penyematan</strong></td><td><strong>Dimensi</strong></td><td><strong>Ukuran</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td></tr>
</tbody>
</table>
<p>Tabel: Dataset yang digunakan di VDBBench</p>
<p>VDBBench juga mendukung dataset khusus, sehingga Anda dapat melakukan pembandingan dengan data Anda sendiri yang dihasilkan dari model penyematan khusus untuk beban kerja spesifik Anda. Lagi pula, tidak ada set data yang menceritakan kisah yang lebih baik daripada data produksi Anda sendiri.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Desain Metrik yang Berfokus pada Produksi</h3><p><strong>VDBBench memprioritaskan metrik yang mencerminkan kinerja dunia nyata, bukan hanya hasil lab.</strong> Kami telah mendesain ulang pembandingan seputar hal yang benar-benar penting di lingkungan produksi: keandalan di bawah beban, latensi ekor, throughput berkelanjutan, dan akurasi.</p>
<ul>
<li><p><strong>Latensi P95/P99 untuk mengukur pengalaman pengguna yang sesungguhnya</strong>: Latensi rata-rata/median menyembunyikan outlier yang membuat frustasi pengguna sesungguhnya. Itulah mengapa VDBBench berfokus pada latensi ekor seperti P95/P99, yang mengungkapkan kinerja apa yang sebenarnya akan dicapai oleh 95% atau 99% kueri Anda.</p></li>
<li><p><strong>Throughput yang berkelanjutan di bawah beban:</strong> Sistem yang berkinerja baik selama 5 detik tidak cukup untuk produksi. VDBBench secara bertahap meningkatkan konkurensi untuk menemukan kueri berkelanjutan maksimum basis data Anda per detik (<code translate="no">max_qps</code>) - bukan angka puncak dalam kondisi yang singkat dan ideal. Hal ini menunjukkan seberapa baik sistem Anda bertahan dari waktu ke waktu.</p></li>
<li><p><strong>Daya ingat seimbang dengan kinerja:</strong> Kecepatan tanpa akurasi tidak ada artinya. Setiap angka performa di VDBBench dipasangkan dengan recall, sehingga Anda tahu persis seberapa besar relevansi yang Anda tukar dengan throughput. Hal ini memungkinkan perbandingan yang adil dan setara antara sistem dengan pengorbanan internal yang sangat berbeda.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodologi Pengujian yang Mencerminkan Realitas</h3><p>Inovasi utama dalam desain VDBBench adalah <strong>pemisahan pengujian serial dan pengujian bersamaan</strong>, yang membantu menangkap bagaimana sistem berperilaku di bawah berbagai jenis beban. Misalnya, metrik latensi dibagi sebagai berikut:</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> mengukur kinerja sistem di bawah beban minimal, di mana hanya satu permintaan yang diproses dalam satu waktu. Ini merupakan <em>skenario kasus terbaik</em> untuk latensi.</p></li>
<li><p><code translate="no">conc_latency_p99</code> menangkap perilaku sistem di bawah <em>kondisi konkurensi yang realistis dan tinggi</em>, di mana banyak permintaan datang secara bersamaan.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">Dua Fase Benchmark</h3><p>VDBBench memisahkan pengujian menjadi dua fase penting:</p>
<ol>
<li><strong>Uji Serial</strong></li>
</ol>
<p>Ini adalah proses tunggal yang menjalankan 1.000 permintaan. Fase ini menetapkan garis dasar untuk kinerja dan akurasi yang ideal, melaporkan <code translate="no">serial_latency_p99</code> dan recall.</p>
<ol start="2">
<li><strong>Uji Konkurensi</strong></li>
</ol>
<p>Fase ini mensimulasikan lingkungan produksi di bawah beban yang berkelanjutan.</p>
<ul>
<li><p><strong>Simulasi klien yang realistis</strong>: Setiap proses pengujian beroperasi secara independen dengan koneksi dan kumpulan kueri sendiri. Hal ini untuk menghindari gangguan shared-state (misalnya, cache) yang dapat mendistorsi hasil.</p></li>
<li><p><strong>Awal yang disinkronkan</strong>: Semua proses dimulai secara bersamaan, memastikan bahwa QPS yang diukur secara akurat mencerminkan tingkat konkurensi yang diklaim.</p></li>
</ul>
<p>Metode yang terstruktur dengan cermat ini memastikan bahwa nilai <code translate="no">max_qps</code> dan <code translate="no">conc_latency_p99</code> yang dilaporkan oleh VDBBench <strong>akurat dan relevan dengan produksi</strong>, sehingga memberikan wawasan yang berarti untuk perencanaan kapasitas produksi dan desain sistem.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: QPS dan Latensi Milvus-16c64g-standalone pada Tingkat Konkurensi yang Bervariasi (Uji Cohere 1M). Dalam pengujian ini, Milvus pada awalnya kurang dimanfaatkan - hingga</em> <strong><em>tingkat konkurensi 20</em></strong><em>, peningkatan konkurensi meningkatkan pemanfaatan sistem dan menghasilkan QPS yang lebih tinggi. Di luar</em> <strong><em>konkurensi 20</em></strong><em>, sistem mencapai beban penuh: peningkatan konkurensi lebih lanjut tidak lagi meningkatkan throughput, dan latensi meningkat karena penundaan antrian</em>.</p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">Lebih dari Sekadar Mencari Data Statis: Skenario Produksi Nyata<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>Sepengetahuan kami, VDBBench adalah satu-satunya alat benchmark yang menguji database vektor di seluruh spektrum lengkap skenario produksi yang penting, termasuk pengumpulan data statis, pemfilteran, dan streaming.</p>
<h3 id="Static-Collection" class="common-anchor-header">Koleksi Statis</h3><p>Tidak seperti benchmark lain yang terburu-buru melakukan pengujian, VDBBench terlebih dahulu memastikan setiap database telah sepenuhnya mengoptimalkan indeksnya-sebuah prasyarat produksi kritis yang sering diabaikan oleh banyak benchmark. Hal ini memberikan Anda gambaran yang lengkap:</p>
<ul>
<li><p>Waktu konsumsi data</p></li>
<li><p>Waktu pengindeksan (waktu yang digunakan untuk membangun indeks yang dioptimalkan, yang secara dramatis memengaruhi kinerja pencarian)</p></li>
<li><p>Performa pencarian pada indeks yang dioptimalkan sepenuhnya dalam kondisi serial dan bersamaan</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">Pemfilteran</h3><p>Pencarian vektor dalam produksi jarang terjadi secara terpisah. Aplikasi nyata menggabungkan kemiripan vektor dengan pemfilteran metadata ("temukan sepatu yang terlihat seperti foto ini tetapi harganya di bawah $100"). Pencarian vektor yang difilter ini menciptakan tantangan yang unik:</p>
<ul>
<li><p><strong>Kerumitan Filter</strong>: Lebih banyak kolom skalar dan kondisi logika meningkatkan tuntutan komputasi</p></li>
<li><p><strong>Selektivitas Filter</strong>: <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pengalaman produksi kami</a> mengungkapkan hal ini sebagai pembunuh kinerja tersembunyi - kecepatan query dapat berfluktuasi dengan urutan besarnya tergantung pada seberapa selektif filter</p></li>
</ul>
<p>VDBBench secara sistematis mengevaluasi kinerja filter di berbagai tingkat selektivitas (dari 50% hingga 99,9%), memberikan profil komprehensif tentang bagaimana database menangani pola produksi yang kritis ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: QPS dan Recall dari Milvus dan OpenSearch di Berbagai Tingkat Selektivitas Filter yang Berbeda (Uji Cohere 1M). Sumbu X menunjukkan persentase data yang disaring. Seperti yang ditunjukkan, Milvus mempertahankan recall yang tinggi secara konsisten di semua tingkat selektivitas filter, sementara OpenSearch menunjukkan kinerja yang tidak stabil, dengan recall yang berfluktuasi secara signifikan di bawah kondisi pemfilteran yang berbeda.</em></p>
<h3 id="Streaming" class="common-anchor-header">Streaming</h3><p>Sistem produksi jarang menikmati kemewahan data statis. Informasi baru terus mengalir saat pencarian dijalankan - sebuah skenario di mana banyak database yang mengesankan menjadi runtuh.</p>
<p>Kasus uji streaming unik dari VDBBench menguji kinerja pencarian-sambil-memasukkan, mengukur:</p>
<ol>
<li><p><strong>Dampak Pertumbuhan Volume Data</strong>: Bagaimana kinerja pencarian meningkat seiring dengan bertambahnya ukuran data.</p></li>
<li><p><strong>Dampak Beban Tulis</strong>: Bagaimana penulisan secara bersamaan memengaruhi latensi dan throughput pencarian, karena penulisan juga menghabiskan sumber daya CPU atau memori dalam sistem.</p></li>
</ol>
<p>Skenario streaming mewakili uji beban yang komprehensif untuk basis data vektor apa pun. Namun, membuat tolok ukur yang <em>adil</em> untuk hal ini tidaklah mudah. Tidaklah cukup hanya dengan mendeskripsikan perilaku satu sistem-kita membutuhkan model evaluasi yang konsisten yang memungkinkan <strong>perbandingan apple-to-apple</strong> di berbagai database.</p>
<p>Berdasarkan pengalaman kami dalam membantu perusahaan dalam penerapan di dunia nyata, kami membangun pendekatan yang terstruktur dan dapat diulang. Dengan VDBBench:</p>
<ul>
<li><p>Anda <strong>menentukan tingkat penyisipan tetap</strong> yang mencerminkan beban kerja produksi target Anda.</p></li>
<li><p>VDBBench kemudian menerapkan <strong>tekanan beban</strong> yang sama di semua sistem, memastikan hasil kinerja dapat dibandingkan secara langsung.</p></li>
</ul>
<p>Misalnya, dengan dataset Cohere 10M dan target pemasukan 500 baris/detik:</p>
<ul>
<li><p>VDBBench menjalankan 5 proses produsen paralel, masing-masing menyisipkan 100 baris per detik.</p></li>
<li><p>Setelah setiap 10% data tertelan, VDBBench memicu putaran pengujian pencarian dalam kondisi serial dan bersamaan.</p></li>
<li><p>Metrik seperti latensi, QPS, dan recall dicatat setelah setiap tahap.</p></li>
</ul>
<p>Metodologi terkontrol ini mengungkapkan bagaimana kinerja setiap sistem berevolusi dari waktu ke waktu dan di bawah tekanan operasional yang nyata-memberi Anda wawasan yang Anda butuhkan untuk membuat keputusan infrastruktur yang berskala.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: QPS dan Recall Pinecone vs Elasticsearch dalam Uji Streaming Cohere 10M (Laju Konsumsi 500 baris/s). Pinecone mempertahankan QPS dan recall yang lebih tinggi, menunjukkan peningkatan QPS yang signifikan setelah memasukkan 100% data.</em></p>
<p>Namun ini bukanlah akhir dari cerita. VDBBench melangkah lebih jauh dengan mendukung langkah pengoptimalan opsional, yang memungkinkan pengguna untuk membandingkan kinerja pencarian streaming sebelum dan sesudah pengoptimalan indeks. VDBBench juga melacak dan melaporkan waktu aktual yang dihabiskan untuk setiap tahap, menawarkan wawasan yang lebih dalam tentang efisiensi dan perilaku sistem dalam kondisi seperti produksi.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: QPS dan Recall Pinecone vs Elasticsearch dalam Tes Streaming Cohere 10M Setelah Pengoptimalan (Laju Konsumsi 500 baris/s)</em></p>
<p>Seperti yang ditunjukkan pada diagram, ElasticSearch melampaui Pinecone dalam QPS-setelah pengoptimalan indeks. Sebuah keajaiban? Tidak juga. Diagram di sebelah kanan menceritakan kisah lengkapnya: setelah sumbu x mencerminkan waktu yang telah berlalu, jelas bahwa ElasticSearch membutuhkan waktu yang jauh lebih lama untuk mencapai kinerja tersebut. Dan dalam produksi, penundaan itu penting. Perbandingan ini mengungkapkan sebuah pertukaran utama: throughput puncak vs. waktu untuk melayani.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">Pilih Basis Data Vektor Anda dengan Penuh Keyakinan<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>Kesenjangan antara hasil benchmark dan kinerja dunia nyata seharusnya tidak menjadi permainan tebak-tebakan. VDBBench menyediakan cara untuk mengevaluasi database vektor dalam kondisi yang realistis dan mirip dengan kondisi produksi, termasuk konsumsi data secara terus menerus, pemfilteran metadata, dan beban kerja streaming.</p>
<p>Jika Anda berencana menerapkan database vektor dalam produksi, ada baiknya Anda memahami bagaimana kinerjanya di luar pengujian laboratorium yang ideal. VDBBench bersifat open-source, transparan, dan dirancang untuk mendukung perbandingan yang bermakna, apples-to-apples.</p>
<p>Cobalah VDBBench dengan beban kerja Anda sendiri hari ini dan lihat bagaimana sistem yang berbeda dapat bertahan dalam praktiknya: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench.</a></p>
<p>Ada pertanyaan atau ingin membagikan hasil pengujian Anda? Bergabunglah dengan percakapan di<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> atau terhubung dengan komunitas kami di <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>. Kami ingin mendengar pendapat Anda.</p>
