---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Cara Meningkatkan dengan Aman dari Milvus 2.5.x ke Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Jelajahi apa yang baru di Milvus 2.6, termasuk perubahan arsitektur dan
  fitur-fitur utama, dan pelajari cara melakukan upgrade bergulir dari Milvus
  2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> telah tersedia untuk sementara waktu, dan ini terbukti menjadi langkah maju yang solid untuk proyek ini. Rilis ini menghadirkan arsitektur yang disempurnakan, kinerja real-time yang lebih kuat, konsumsi sumber daya yang lebih rendah, dan perilaku penskalaan yang lebih cerdas dalam lingkungan produksi. Banyak dari peningkatan ini dibentuk langsung oleh umpan balik pengguna, dan pengguna awal 2.6.x telah melaporkan pencarian yang lebih cepat dan kinerja sistem yang lebih dapat diprediksi di bawah beban kerja yang berat atau dinamis.</p>
<p>Untuk tim yang menjalankan Milvus 2.5.x dan sedang mengevaluasi perpindahan ke 2.6.x, panduan ini adalah titik awal Anda. Panduan ini menguraikan perbedaan arsitektur, menyoroti kemampuan utama yang diperkenalkan di Milvus 2.6, dan menyediakan jalur peningkatan langkah demi langkah yang praktis yang dirancang untuk meminimalkan gangguan operasional.</p>
<p>Jika beban kerja Anda melibatkan pipeline real-time, pencarian multimodal atau hibrida, atau operasi vektor berskala besar, blog ini akan membantu Anda menilai apakah 2.6 selaras dengan kebutuhan Anda - dan jika Anda memutuskan untuk melanjutkan, tingkatkan dengan percaya diri dengan tetap menjaga integritas data dan ketersediaan layanan.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Perubahan Arsitektur dari Milvus 2.5 ke Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk ke dalam alur kerja peningkatan itu sendiri, mari kita pahami terlebih dahulu bagaimana arsitektur Milvus berubah di Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Arsitektur Milvus 2.5</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Milvus 2.5</span> </span></p>
<p>Dalam Milvus 2.5, alur kerja streaming dan batch saling terkait di beberapa node pekerja:</p>
<ul>
<li><p><strong>QueryNode</strong> menangani kueri historis <em>dan</em> kueri tambahan (streaming).</p></li>
<li><p><strong>DataNode</strong> menangani pembilasan waktu konsumsi <em>dan</em> pemadatan latar belakang pada data historis.</p></li>
</ul>
<p>Pencampuran logika batch dan real-time ini menyulitkan untuk menskalakan beban kerja batch secara independen. Hal ini juga berarti status streaming tersebar di beberapa komponen, menimbulkan penundaan sinkronisasi, mempersulit pemulihan kegagalan, dan meningkatkan kompleksitas operasional.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Arsitektur Milvus 2.6</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Milvus 2.6</span> </span></p>
<p>Milvus 2.6 memperkenalkan <strong>StreamingNode</strong> khusus yang menangani semua tanggung jawab data waktu nyata: mengonsumsi antrean pesan, menulis segmen tambahan, melayani permintaan tambahan, dan mengelola pemulihan berbasis WAL. Dengan streaming yang terisolasi, komponen yang tersisa mengambil peran yang lebih bersih dan terfokus:</p>
<ul>
<li><p><strong>QueryNode</strong> sekarang <em>hanya</em> menangani kueri batch pada segmen historis.</p></li>
<li><p><strong>DataNode</strong> sekarang <em>hanya</em> menangani tugas-tugas data historis seperti pemadatan dan pembuatan indeks.</p></li>
</ul>
<p>StreamingNode menyerap semua tugas terkait streaming yang tadinya dibagi di antara DataNode, QueryNode, dan bahkan Proxy di Milvus 2.5, sehingga memberikan kejelasan dan mengurangi pembagian status lintas peran.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x vs Milvus 2.6.x: Perbandingan Komponen per Komponen</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>Apa yang Berubah</strong></th></tr>
</thead>
<tbody>
<tr><td>Layanan Koordinator</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (atau MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">Manajemen metadata dan penjadwalan tugas dikonsolidasikan ke dalam satu MixCoord, menyederhanakan logika koordinasi dan mengurangi kompleksitas yang terdistribusi.</td></tr>
<tr><td>Lapisan Akses</td><td style="text-align:center">Proxy</td><td style="text-align:center">Proxy</td><td style="text-align:center">Permintaan penulisan hanya diarahkan melalui Streaming Node untuk konsumsi data.</td></tr>
<tr><td>Node Pekerja</td><td style="text-align:center">-</td><td style="text-align:center">Streaming Node</td><td style="text-align:center">Node pemrosesan streaming khusus yang bertanggung jawab atas semua logika inkremental (segmen yang terus bertambah), termasuk: - Konsumsi data inkremental - Kueri data inkremental - Menyimpan data inkremental ke penyimpanan objek - Penulisan berbasis streaming - Pemulihan kegagalan berdasarkan WAL</td></tr>
<tr><td></td><td style="text-align:center">Simpul Kueri</td><td style="text-align:center">Simpul Kueri</td><td style="text-align:center">Node pemrosesan batch yang menangani kueri atas data historis saja.</td></tr>
<tr><td></td><td style="text-align:center">Simpul Data</td><td style="text-align:center">Simpul Data</td><td style="text-align:center">Node pemrosesan-batch yang bertanggung jawab atas data historis saja, termasuk pemadatan dan pembuatan indeks.</td></tr>
<tr><td></td><td style="text-align:center">Simpul Indeks</td><td style="text-align:center">-</td><td style="text-align:center">Index Node digabungkan ke dalam Data Node, menyederhanakan definisi peran dan topologi penyebaran.</td></tr>
</tbody>
</table>
<p>Singkatnya, Milvus 2.6 menarik garis yang jelas antara beban kerja streaming dan batch, menghilangkan keterikatan lintas komponen yang terlihat pada 2.5 dan menciptakan arsitektur yang lebih terukur dan dapat dipelihara.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Sorotan Fitur Milvus 2.6<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk ke alur kerja peningkatan, berikut ini adalah sekilas tentang apa yang dibawa Milvus 2.6. <strong>Rilis ini berfokus pada penurunan biaya infrastruktur, peningkatan kinerja pencarian, dan membuat beban kerja AI yang besar dan dinamis menjadi lebih mudah untuk diskalakan.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Peningkatan Biaya &amp; Efisiensi</h3><ul>
<li><p><strong>Kuantisasi</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>untuk Indeks Utama</strong> - Metode kuantisasi 1-bit baru yang memampatkan indeks vektor menjadi <strong>1/32</strong> dari ukuran aslinya. Dikombinasikan dengan SQ8 reranking, metode ini mengurangi penggunaan memori hingga ~28%, meningkatkan QPS hingga 4×, dan mempertahankan recall ~95%, sehingga secara signifikan menurunkan biaya perangkat keras.</p></li>
<li><p><strong>Pencarian Teks Lengkap</strong><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>yang Dioptimalkan BM25</strong></a> - Penilaian BM25 asli yang didukung oleh vektor bobot istilah yang jarang. Pencarian kata kunci berjalan <strong>3-4× lebih cepat</strong> (hingga <strong>7×</strong> pada beberapa dataset) dibandingkan dengan Elasticsearch, dengan tetap menjaga ukuran indeks sekitar sepertiga dari data teks asli.</p></li>
<li><p><strong>Pengindeksan Jalur JSON dengan Penghancuran JSON</strong> - Pemfilteran terstruktur pada JSON bersarang sekarang jauh lebih cepat dan jauh lebih dapat diprediksi. Jalur JSON yang telah diindeks sebelumnya memotong latensi filter dari <strong>140 ms → 1,5 ms</strong> (P99: <strong>480 ms → 10 ms</strong>), sehingga pencarian vektor hibrida + pemfilteran metadata menjadi jauh lebih responsif.</p></li>
<li><p><strong>Dukungan Tipe Data yang Diperluas</strong> - Menambahkan tipe vektor Int8, bidang <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">Geometri</a> (POINT / LINESTRING / POLYGON), dan Array-of-Structs. Ekstensi ini mendukung beban kerja geospasial, pemodelan metadata yang lebih kaya, dan skema yang lebih bersih.</p></li>
<li><p><strong>Upsert untuk Pembaruan Parsial</strong> - Anda sekarang dapat menyisipkan atau memperbarui entitas menggunakan satu panggilan primary-key. Pembaruan parsial hanya memodifikasi bidang yang disediakan, mengurangi amplifikasi penulisan dan menyederhanakan pipeline yang sering menyegarkan metadata atau penyematan.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Peningkatan Pencarian dan Pengambilan</h3><ul>
<li><p><strong>Peningkatan Pemrosesan Teks &amp; Dukungan Multibahasa:</strong> Tokeniser Lindera dan ICU baru meningkatkan penanganan teks bahasa Jepang, Korea, dan <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">multi-bahasa</a>. Jieba sekarang mendukung kamus khusus. <code translate="no">run_analyzer</code> membantu men-debug perilaku tokenisasi, dan penganalisis multi-bahasa memastikan pencarian lintas-bahasa yang konsisten.</p></li>
<li><p><strong>Pencocokan Teks Presisi Tinggi:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">Pencocokan Frasa</a> memberlakukan kueri frasa yang dipesan dengan slop yang dapat dikonfigurasi. Indeks <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> yang baru mempercepat kueri substring dan <code translate="no">LIKE</code> pada bidang VARCHAR dan jalur JSON, sehingga memungkinkan pencocokan teks parsial dan fuzzy yang cepat.</p></li>
<li><p><strong>Pemeringkatan Sadar Waktu dan Sadar Metadata:</strong> <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Pemeringkat</a> <a href="https://milvus.io/docs/decay-ranker-overview.md">Peluruhan</a> (eksponensial, linier, Gaussian) menyesuaikan skor menggunakan stempel waktu; <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Pemeringkat Peningkatan</a> menerapkan aturan berbasis metadata untuk mempromosikan atau menurunkan hasil. Keduanya membantu menyempurnakan perilaku pencarian tanpa mengubah data dasar Anda.</p></li>
<li><p><strong>Integrasi Model yang Disederhanakan &amp; Vektorisasi Otomatis:</strong> Integrasi bawaan dengan OpenAI, Hugging Face, dan penyedia penyematan lainnya memungkinkan Milvus secara otomatis memvektorisasi teks selama operasi penyisipan dan kueri. Tidak ada lagi pipeline penyematan manual untuk kasus penggunaan umum.</p></li>
<li><p><strong>Pembaruan Skema Online untuk Bidang Skalar:</strong> Tambahkan bidang skalar baru ke koleksi yang sudah ada tanpa waktu henti atau pemuatan ulang, menyederhanakan evolusi skema seiring dengan bertambahnya kebutuhan metadata.</p></li>
<li><p><strong>Deteksi Hampir Duplikat dengan MinHash:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH memungkinkan deteksi nyaris duplikat yang efisien di seluruh kumpulan data yang besar tanpa perbandingan tepat yang mahal.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Peningkatan Arsitektur dan Skalabilitas</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Penyimpanan Berjenjang</strong></a> <strong>untuk Manajemen Data Panas-Dingin:</strong> Memisahkan data panas dan dingin di seluruh SSD dan penyimpanan objek; mendukung pemuatan malas dan parsial; menghilangkan kebutuhan untuk memuat koleksi secara lokal; mengurangi penggunaan sumber daya hingga 50% dan mempercepat waktu muat untuk set data besar.</p></li>
<li><p><strong>Layanan Streaming Waktu Nyata:</strong> Menambahkan Node Streaming khusus yang terintegrasi dengan Kafka/Pulsar untuk konsumsi terus menerus; memungkinkan pengindeksan langsung dan ketersediaan kueri; meningkatkan throughput penulisan dan mempercepat pemulihan kegagalan untuk beban kerja yang real-time dan cepat berubah.</p></li>
<li><p><strong>Skalabilitas &amp; Stabilitas yang Ditingkatkan:</strong> Milvus kini mendukung 100.000+ koleksi untuk lingkungan multi-penyewa yang besar. Peningkatan infrastruktur - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (zero-disk WAL), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (mengurangi IOPS/memori), dan <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Penggabungan Koordinator</a> - meningkatkan stabilitas cluster dan memungkinkan penskalaan yang dapat diprediksi di bawah beban kerja yang berat.</p></li>
</ul>
<p>Untuk daftar lengkap fitur-fitur Milvus 2.6, lihat <a href="https://milvus.io/docs/release_notes.md">catatan rilis Milvus</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Cara Meningkatkan dari Milvus 2.5.x ke Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Agar sistem tetap tersedia selama proses upgrade, cluster Milvus 2.5 harus diupgrade ke Milvus 2.6 dengan urutan sebagai berikut.</p>
<p><strong>1. Mulai Streaming Node terlebih dahulu</strong></p>
<p>Jalankan Streaming Node terlebih dahulu. <strong>Delegator</strong> baru (komponen dalam Query Node yang bertanggung jawab untuk penanganan data streaming) harus dipindahkan ke Streaming Node Milvus 2.6.</p>
<p><strong>2. Tingkatkan MixCoord</strong></p>
<p>Tingkatkan komponen koordinator ke <strong>MixCoord</strong>. Selama langkah ini, MixCoord perlu mendeteksi versi Worker Node untuk menangani kompatibilitas lintas versi dalam sistem terdistribusi.</p>
<p><strong>3. Tingkatkan Node Kueri</strong></p>
<p>Peningkatan Query Node biasanya membutuhkan waktu lebih lama. Selama fase ini, Milvus 2.5 Data Node dan Index Node dapat terus menangani operasi seperti Flush dan pembangunan Index, membantu mengurangi tekanan dari sisi kueri saat Query Node sedang diupgrade.</p>
<p><strong>4. Meningkatkan Node Data</strong></p>
<p>Setelah Milvus 2.5 DataNodes offline, operasi Flush menjadi tidak tersedia, dan data di Segmen Tumbuh dapat terus terakumulasi hingga semua node sepenuhnya diupgrade ke Milvus 2.6.</p>
<p><strong>5. Meningkatkan Proxy</strong></p>
<p>Setelah mengupgrade Proxy ke Milvus 2.6, operasi tulis pada Proxy tersebut akan tetap tidak tersedia sampai semua komponen cluster diupgrade ke 2.6.</p>
<p><strong>6. Menghapus Simpul Indeks</strong></p>
<p>Setelah semua komponen lain diupgrade, Node Indeks mandiri dapat dihapus dengan aman.</p>
<p><strong>Catatan:</strong></p>
<ul>
<li><p>Dari selesainya peningkatan DataNode hingga selesainya peningkatan Proxy, operasi Flush tidak tersedia.</p></li>
<li><p>Dari saat Proxy pertama diupgrade hingga semua node Proxy diupgrade, beberapa operasi tulis tidak tersedia.</p></li>
<li><p><strong>Ketika mengupgrade langsung dari Milvus 2.5.x ke 2.6.6, operasi DDL (Data Definition Language) tidak tersedia selama proses upgrade karena adanya perubahan pada kerangka kerja DDL.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Cara Meningkatkan ke Milvus 2.6 dengan Milvus Operator<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a> adalah operator Kubernetes sumber terbuka yang menyediakan cara yang dapat diskalakan dan sangat tersedia untuk menerapkan, mengelola, dan memutakhirkan seluruh tumpukan layanan Milvus pada cluster Kubernetes target. Tumpukan layanan Milvus yang dikelola oleh operator meliputi:</p>
<ul>
<li><p>Komponen inti Milvus</p></li>
<li><p>Ketergantungan yang diperlukan seperti etcd, Pulsar, dan MinIO</p></li>
</ul>
<p>Operator Milvus mengikuti pola Operator Kubernetes standar. Ini memperkenalkan Milvus Custom Resource (CR) yang menggambarkan keadaan yang diinginkan dari cluster Milvus, seperti versi, topologi, dan konfigurasinya.</p>
<p>Pengontrol terus memantau cluster dan merekonsiliasi kondisi aktual dengan kondisi yang diinginkan yang didefinisikan dalam CR. Ketika perubahan dilakukan-seperti meningkatkan versi Milvus-operator secara otomatis menerapkannya dengan cara yang terkendali dan berulang, memungkinkan peningkatan otomatis dan manajemen siklus hidup yang berkelanjutan.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Contoh Sumber Daya Khusus (CR) Milvus</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Peningkatan Bergulir dari Milvus 2.5 ke 2.6 dengan Operator Milvus</h3><p>Milvus Operator menyediakan dukungan bawaan untuk <strong>peningkatan bergulir dari Milvus 2.5 ke 2.6</strong> dalam mode klaster, mengadaptasi perilakunya untuk memperhitungkan perubahan arsitektur yang diperkenalkan di 2.6.</p>
<p><strong>1. Deteksi Skenario Peningkatan</strong></p>
<p>Selama peningkatan, Operator Milvus menentukan versi Milvus target dari spesifikasi cluster. Hal ini dilakukan dengan cara:</p>
<ul>
<li><p>Memeriksa tag gambar yang ditentukan di <code translate="no">spec.components.image</code>, atau</p></li>
<li><p>Membaca versi eksplisit yang ditentukan dalam <code translate="no">spec.components.version</code></p></li>
</ul>
<p>Operator kemudian membandingkan versi yang diinginkan ini dengan versi yang saat ini berjalan, yang tercatat di <code translate="no">status.currentImage</code> atau <code translate="no">status.currentVersion</code>. Jika versi saat ini adalah 2.5 dan versi yang diinginkan adalah 2.6, operator mengidentifikasi peningkatan tersebut sebagai skenario peningkatan 2.5 → 2.6.</p>
<p><strong>2. Perintah Eksekusi Peningkatan Bergulir</strong></p>
<p>Ketika peningkatan 2.5 → 2.6 terdeteksi dan mode peningkatan diatur ke peningkatan bergulir (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, yang merupakan default), Operator Milvus secara otomatis melakukan peningkatan dalam urutan yang telah ditentukan sebelumnya yang selaras dengan arsitektur Milvus 2.6:</p>
<p>Mulai Streaming Node → Upgrade MixCoord → Upgrade Node Query → Upgrade Node Data → Upgrade Proxy → Hapus Index Node</p>
<p><strong>3. Konsolidasi Koordinator Otomatis</strong></p>
<p>Milvus 2.6 menggantikan beberapa komponen koordinator dengan satu MixCoord. Operator Milvus menangani transisi arsitektur ini secara otomatis.</p>
<p>Ketika <code translate="no">spec.components.mixCoord</code> dikonfigurasi, operator akan memunculkan MixCoord dan menunggu hingga siap. Setelah MixCoord beroperasi penuh, operator akan mematikan komponen koordinator lama-RootCoord, QueryCoord, dan DataCoord-menyelesaikan migrasi tanpa memerlukan intervensi manual.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Langkah-langkah Peningkatan dari Milvus 2.5 ke 2.6</h3><p>1. Upgrade Milvus Operator ke versi terbaru (Dalam panduan ini, kami menggunakan <strong>versi 1.3.3</strong>, yang merupakan rilis terbaru pada saat panduan ini ditulis).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2. Gabungkan komponen koordinator</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Pastikan cluster menjalankan Milvus 2.5.16 atau yang lebih baru</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4. Tingkatkan Milvus ke versi 2.6</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Cara Memutakhirkan ke Milvus 2.6 dengan Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>Saat menerapkan Milvus menggunakan Helm, semua sumber daya Kubernetes <code translate="no">Deployment</code> diperbarui secara paralel, tanpa urutan eksekusi yang terjamin. Akibatnya, Helm tidak menyediakan kontrol yang ketat terhadap urutan pemutakhiran yang bergulir di seluruh komponen. Untuk lingkungan produksi, menggunakan Milvus Operator sangat disarankan.</p>
<p>Milvus masih dapat ditingkatkan dari 2.5 ke 2.6 menggunakan Helm dengan mengikuti langkah-langkah di bawah ini.</p>
<p>Persyaratan Sistem</p>
<ul>
<li><p><strong>Versi Helm:</strong> ≥ 3.14.0</p></li>
<li><p><strong>Versi Kubernetes:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1. Tingkatkan bagan Milvus Helm ke versi terbaru. Dalam panduan ini, kami menggunakan bagan <strong>versi 5.0.7</strong>, yang merupakan versi terbaru pada saat penulisan.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2. Jika cluster digunakan dengan beberapa komponen koordinator, pertama-tama tingkatkan Milvus ke versi 2.5.16 atau yang lebih baru dan aktifkan MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3. Tingkatkan Milvus ke versi 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">Pertanyaan Umum tentang Peningkatan dan Pengoperasian Milvus 2.6<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">T1: Milvus Helm vs. Milvus Operator - mana yang harus saya gunakan?</h3><p>Untuk lingkungan produksi, Milvus Operator sangat disarankan.</p>
<p>Lihat panduan resmi untuk detailnya: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">T2: Bagaimana saya harus memilih Message Queue (MQ)?</h3><p>MQ yang direkomendasikan tergantung pada mode penerapan dan persyaratan operasional:</p>
<p><strong>1. Mode mandiri:</strong> Untuk penerapan yang sensitif terhadap biaya, RocksMQ direkomendasikan.</p>
<p><strong>2. Mode cluster</strong></p>
<ul>
<li><p><strong>Pulsar</strong> mendukung multi-tenancy, memungkinkan cluster besar untuk berbagi infrastruktur, dan menawarkan skalabilitas horizontal yang kuat.</p></li>
<li><p><strong>Kafka</strong> memiliki ekosistem yang lebih matang, dengan penawaran SaaS terkelola yang tersedia di sebagian besar platform cloud utama.</p></li>
</ul>
<p><strong>3. Woodpecker (diperkenalkan di Milvus 2.6):</strong> Woodpecker menghilangkan kebutuhan akan antrean pesan eksternal, mengurangi biaya dan kompleksitas operasional.</p>
<ul>
<li><p>Saat ini, hanya mode Woodpecker tertanam yang didukung, yang ringan dan mudah dioperasikan.</p></li>
<li><p>Untuk penerapan mandiri Milvus 2.6, Woodpecker direkomendasikan.</p></li>
<li><p>Untuk penerapan cluster produksi, disarankan untuk menggunakan mode cluster Woodpecker yang akan datang setelah tersedia.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">T3: Apakah Antrian Pesan dapat dialihkan selama peningkatan?</h3><p>Tidak. Mengalihkan Antrian Pesan selama peningkatan saat ini tidak didukung. Rilis mendatang akan memperkenalkan API manajemen untuk mendukung peralihan antara Pulsar, Kafka, Woodpecker, dan RocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">T4: Apakah konfigurasi pembatasan laju perlu diperbarui untuk Milvus 2.6?</h3><p>Tidak. Konfigurasi pembatas laju yang ada saat ini tetap efektif dan juga berlaku untuk Streaming Node yang baru. Tidak ada perubahan yang diperlukan.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">T5: Setelah penggabungan koordinator, apakah peran atau konfigurasi pemantauan berubah?</h3><ul>
<li><p>Peran pemantauan tetap tidak berubah (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>Opsi konfigurasi yang ada akan tetap berfungsi seperti sebelumnya.</p></li>
<li><p>Opsi konfigurasi baru, <code translate="no">mixCoord.enableActiveStandby</code>, diperkenalkan dan akan kembali ke <code translate="no">rootcoord.enableActiveStandby</code> jika tidak diatur secara eksplisit.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">T6: Apa saja pengaturan sumber daya yang direkomendasikan untuk StreamingNode?</h3><ul>
<li><p>Untuk konsumsi waktu nyata yang ringan atau beban kerja tulis-dan-query sesekali, konfigurasi yang lebih kecil, seperti 2 inti CPU dan memori 8 GB, sudah cukup.</p></li>
<li><p>Untuk konsumsi waktu nyata yang berat atau beban kerja tulis-dan-query yang terus menerus, disarankan untuk mengalokasikan sumber daya yang sebanding dengan sumber daya Query Node.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">T7: Bagaimana cara meningkatkan penerapan mandiri menggunakan Docker Compose?</h3><p>Untuk deployment mandiri berbasis Docker Compose, cukup perbarui tag citra Milvus di <code translate="no">docker-compose.yaml</code>.</p>
<p>Lihat panduan resmi untuk detailnya: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
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
    </button></h2><p>Milvus 2.6 menandai peningkatan besar dalam arsitektur dan operasi. Dengan memisahkan pemrosesan streaming dan batch dengan memperkenalkan StreamingNode, mengkonsolidasikan koordinator ke dalam MixCoord, dan menyederhanakan peran pekerja, Milvus 2.6 menyediakan fondasi yang lebih stabil, dapat diskalakan, dan lebih mudah dioperasikan untuk beban kerja vektor berskala besar.</p>
<p>Perubahan arsitektur ini membuat peningkatan - terutama dari Milvus 2.5 - menjadi lebih sensitif terhadap pesanan. Peningkatan yang berhasil bergantung pada ketergantungan komponen dan batasan ketersediaan sementara. Untuk lingkungan produksi, Milvus Operator adalah pendekatan yang direkomendasikan, karena mengotomatiskan urutan peningkatan dan mengurangi risiko operasional, sementara peningkatan berbasis Helm lebih cocok untuk kasus penggunaan nonproduksi.</p>
<p>Dengan kemampuan pencarian yang ditingkatkan, tipe data yang lebih kaya, penyimpanan berjenjang, dan opsi antrean pesan yang lebih baik, Milvus 2.6 memiliki posisi yang tepat untuk mendukung aplikasi AI modern yang membutuhkan konsumsi waktu nyata, kinerja kueri yang tinggi, dan operasi yang efisien dalam skala besar.</p>
<p>Ada pertanyaan atau ingin mendalami fitur-fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Sumber Daya Lebih Lanjut tentang Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/docs/release_notes.md">Catatan Rilis Milvus 2.6</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Rekaman Webinar Milvus 2.6: Pencarian Lebih Cepat, Biaya Lebih Rendah, dan Penskalaan Lebih Cerdas</a></p></li>
<li><p>Milvus 2.6 Fitur Blog</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Memperkenalkan Fungsi Penyematan: Bagaimana Milvus 2.6 Menyederhanakan Vektorisasi dan Pencarian Semantik</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Penghancuran JSON di Milvus: Pemfilteran JSON 88,9x Lebih Cepat dengan Fleksibilitas</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Membuka Pengambilan Tingkat Entitas yang Sebenarnya: Kemampuan Array-of-Structs dan MAX_SIM Baru di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Berhenti Membayar untuk Data Dingin: Pengurangan Biaya 80% dengan Pemuatan Data Panas-Dingin Sesuai Permintaan di Penyimpanan Berjenjang Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Memperkenalkan AISAQ di Milvus: Pencarian Vektor Berskala Miliaran Baru Saja Menjadi 3.200× Lebih Murah pada Memori</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Mengoptimalkan NVIDIA CAGRA di Milvus: Pendekatan Hibrida GPU-CPU untuk Pengindeksan yang Lebih Cepat dan Kueri yang Lebih Murah</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Memperkenalkan Milvus Ngram Index: Pencocokan Kata Kunci dan Kueri LIKE yang Lebih Cepat untuk Beban Kerja Agen</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Menyatukan Pemfilteran Geospasial dan Pencarian Vektor dengan Bidang Geometri dan RTREE di Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pencarian Vektor di Dunia Nyata: Cara Memfilter Secara Efisien Tanpa Mematikan Recall</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmark Bohong - DB Vektor Layak Mendapat Ujian Nyata</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Pelatuk untuk Milvus - Inilah yang Terjadi</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikat dalam Data Pelatihan LLM</a></p></li>
</ul></li>
</ul>
