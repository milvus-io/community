---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: >-
  Kami Mengganti Kafka/Pulsar dengan Burung Pelatuk untuk Milvus-Berikut yang
  Terjadi
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  Kami membangun Woodpecker, sebuah sistem WAL cloud-native, untuk menggantikan
  Kafka dan Pulsar di Milvus dengan kompleksitas dan biaya operasional yang
  lebih rendah.
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL; DR:</strong> Kami membangun Woodpecker, sebuah sistem Write-Ahead Logging (WAL) yang berasal dari cloud, untuk menggantikan Kafka dan Pulsar di Milvus 2.6. Hasilnya? Operasi yang disederhanakan, kinerja yang lebih baik, dan biaya yang lebih rendah untuk basis data vektor Milvus kami.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">Titik Awal: Ketika Antrian Pesan Tidak Lagi Sesuai<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami menyukai dan menggunakan Kafka dan Pulsar. Keduanya berfungsi sampai tidak berfungsi lagi. Seiring dengan perkembangan Milvus, basis data vektor sumber terbuka terkemuka, kami menemukan bahwa antrean pesan yang kuat ini tidak lagi memenuhi persyaratan skalabilitas kami. Jadi kami mengambil langkah berani: kami menulis ulang tulang punggung streaming di Milvus 2.6 dan mengimplementasikan WAL kami sendiri - <strong>Woodpecker</strong>.</p>
<p>Izinkan saya memandu Anda melalui perjalanan kami dan menjelaskan mengapa kami melakukan perubahan ini, yang mungkin terlihat berlawanan dengan intuisi pada pandangan pertama.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">Cloud-Native Sejak Hari Pertama<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus telah menjadi basis data vektor cloud-native sejak awal. Kami memanfaatkan Kubernetes untuk penskalaan elastis dan pemulihan kegagalan yang cepat, di samping solusi penyimpanan objek seperti Amazon S3 dan MinIO untuk persistensi data.</p>
<p>Pendekatan cloud-first ini menawarkan keuntungan yang luar biasa, tetapi juga menghadirkan beberapa tantangan:</p>
<ul>
<li><p>Layanan penyimpanan objek cloud seperti S3 memberikan kemampuan penanganan throughput dan ketersediaan yang hampir tak terbatas, namun dengan latensi yang sering kali melebihi 100ms.</p></li>
<li><p>Model penetapan harga layanan ini (berdasarkan pola akses dan frekuensi) dapat menambah biaya tak terduga pada operasi basis data real-time.</p></li>
<li><p>Menyeimbangkan karakteristik cloud-native dengan tuntutan pencarian vektor waktu nyata menimbulkan tantangan arsitektur yang signifikan.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">Arsitektur Log Bersama: Landasan Kami<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak sistem pencarian vektor membatasi diri pada pemrosesan batch karena membangun sistem streaming di lingkungan cloud-native menghadirkan tantangan yang lebih besar. Sebaliknya, Milvus memprioritaskan kesegaran data secara real-time dan mengimplementasikan arsitektur log bersama - anggap saja sebagai hard drive untuk sistem file.</p>
<p>Arsitektur log bersama ini menyediakan fondasi penting yang memisahkan protokol konsensus dari fungsionalitas basis data inti. Dengan mengadopsi pendekatan ini, Milvus menghilangkan kebutuhan untuk mengelola protokol konsensus yang kompleks secara langsung, sehingga kami dapat fokus untuk memberikan kemampuan pencarian vektor yang luar biasa.</p>
<p>Kami tidak sendirian dalam pola arsitektur ini-database seperti AWS Aurora, Azure Socrates, dan Neon semuanya memanfaatkan desain yang serupa. <strong>Namun, kesenjangan yang signifikan masih ada dalam ekosistem open-source: terlepas dari keuntungan yang jelas dari pendekatan ini, komunitas tidak memiliki implementasi write-ahead log (WAL) terdistribusi dengan latensi rendah, dapat diskalakan, dan hemat biaya.</strong></p>
<p>Solusi yang ada seperti Bookie terbukti tidak memadai untuk kebutuhan kami karena desain klien kelas berat mereka dan tidak adanya SDK yang siap produksi untuk Golang dan C++. Kesenjangan teknologi ini membawa kami ke pendekatan awal kami dengan antrian pesan.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">Solusi Awal Kami: Antrian Pesan sebagai WAL<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk menjembatani kesenjangan ini, pendekatan awal kami menggunakan antrean pesan (Kafka/Pulsar) sebagai write-ahead log (WAL). Arsitekturnya bekerja seperti ini:</p>
<ul>
<li><p>Semua pembaruan waktu nyata yang masuk mengalir melalui antrean pesan.</p></li>
<li><p>Penulis menerima konfirmasi langsung setelah diterima oleh antrean pesan.</p></li>
<li><p>QueryNode dan DataNode memproses data ini secara asinkron, memastikan throughput penulisan yang tinggi sambil mempertahankan kesegaran data</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Gambaran Umum Arsitektur Milvus 2.0</p>
<p>Sistem ini secara efektif memberikan konfirmasi penulisan langsung sekaligus memungkinkan pemrosesan data asinkron, yang sangat penting untuk menjaga keseimbangan antara throughput dan kesegaran data yang diharapkan oleh para pengguna Milvus.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">Mengapa Kami Membutuhkan Sesuatu yang Berbeda untuk WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan Milvus 2.6, kami telah memutuskan untuk menghapus antrean pesan eksternal dan memilih Woodpecker, implementasi WAL yang dibuat khusus untuk cloud. Ini bukanlah keputusan yang kami ambil dengan mudah. Bagaimanapun juga, kami telah berhasil menggunakan Kafka dan Pulsar selama bertahun-tahun.</p>
<p>Masalahnya bukan pada teknologi ini sendiri-keduanya merupakan sistem yang sangat baik dengan kemampuan yang kuat. Namun, tantangannya datang dari meningkatnya kompleksitas dan biaya tambahan yang diperkenalkan oleh sistem eksternal ini seiring dengan perkembangan Milvus. Ketika kebutuhan kami menjadi lebih terspesialisasi, kesenjangan antara apa yang ditawarkan oleh antrean pesan tujuan umum dan apa yang dibutuhkan oleh basis data vektor kami terus melebar.</p>
<p>Tiga faktor spesifik pada akhirnya mendorong keputusan kami untuk membangun penggantinya:</p>
<h3 id="Operational-Complexity" class="common-anchor-header">Kompleksitas Operasional</h3><p>Ketergantungan eksternal seperti Kafka atau Pulsar menuntut mesin khusus dengan banyak node dan manajemen sumber daya yang cermat. Hal ini menciptakan beberapa tantangan:</p>
<ul>
<li>Meningkatnya kompleksitas operasional</li>
</ul>
<ul>
<li>Kurva pembelajaran yang lebih curam untuk administrator sistem</li>
</ul>
<ul>
<li>Risiko kesalahan konfigurasi dan kerentanan keamanan yang lebih tinggi</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">Kendala Arsitektur</h3><p>Antrean pesan seperti Kafka memiliki keterbatasan inheren pada jumlah topik yang didukung. Kami mengembangkan VShard sebagai solusi untuk berbagi topik di seluruh komponen, tetapi solusi ini - meskipun secara efektif menangani kebutuhan penskalaan - memperkenalkan kompleksitas arsitektur yang signifikan.</p>
<p>Ketergantungan eksternal ini mempersulit implementasi fitur-fitur penting-seperti pengumpulan sampah log-dan meningkatkan gesekan integrasi dengan modul sistem lainnya. Seiring berjalannya waktu, ketidaksesuaian arsitektur antara antrean pesan untuk tujuan umum dan tuntutan kinerja tinggi yang spesifik dari basis data vektor menjadi semakin jelas, sehingga mendorong kami untuk menilai kembali pilihan desain kami.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">Inefisiensi Sumber Daya</h3><p>Memastikan ketersediaan yang tinggi dengan sistem seperti Kafka dan Pulsar biasanya menuntut:</p>
<ul>
<li><p>Penerapan terdistribusi di beberapa node</p></li>
<li><p>Alokasi sumber daya yang besar bahkan untuk beban kerja yang lebih kecil</p></li>
<li><p>Penyimpanan untuk sinyal sesaat (seperti Timetick dari Milvus), yang sebenarnya tidak memerlukan penyimpanan jangka panjang</p></li>
</ul>
<p>Namun, sistem ini tidak memiliki fleksibilitas untuk memotong persistensi untuk sinyal sementara seperti itu, yang mengarah ke operasi I / O dan penggunaan penyimpanan yang tidak perlu. Hal ini menyebabkan overhead sumber daya yang tidak proporsional dan peningkatan biaya - terutama dalam skala yang lebih kecil atau lingkungan dengan sumber daya terbatas.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Memperkenalkan Woodpecker - Mesin WAL Cloud-Native dan Berkinerja Tinggi<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Di Milvus 2.6, kami telah mengganti Kafka/Pulsar dengan <strong>Woodpecker</strong>, sebuah sistem WAL yang dibuat khusus untuk cloud. Didesain untuk penyimpanan objek, Woodpecker menyederhanakan operasi sekaligus meningkatkan kinerja dan skalabilitas.</p>
<p>Woodpecker dibangun dari bawah ke atas untuk memaksimalkan potensi penyimpanan cloud-native, dengan tujuan terfokus: menjadi solusi WAL dengan throughput tertinggi yang dioptimalkan untuk lingkungan cloud sambil memberikan kemampuan inti yang diperlukan untuk log yang hanya dapat ditambahkan ke depan.</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">Arsitektur Nol-Disk untuk Woodpecker</h3><p>Inovasi inti Woodpecker adalah <strong>arsitektur Zero-Disk</strong>:</p>
<ul>
<li><p>Semua data log disimpan dalam penyimpanan objek cloud (seperti Amazon S3, Google Cloud Storage, atau Alibaba OS)</p></li>
<li><p>Metadata dikelola melalui penyimpanan nilai kunci terdistribusi seperti etcd</p></li>
<li><p>Tidak ada ketergantungan disk lokal untuk operasi inti</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar:  Gambaran Umum Arsitektur Woodpecker</p>
<p>Pendekatan ini secara dramatis mengurangi biaya operasional sekaligus memaksimalkan daya tahan dan efisiensi cloud. Dengan menghilangkan ketergantungan disk lokal, Woodpecker selaras dengan prinsip-prinsip cloud-native dan secara signifikan mengurangi beban operasional pada administrator sistem.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">Tolok Ukur Kinerja: Melebihi Ekspektasi</h3><p>Kami menjalankan tolok ukur yang komprehensif untuk mengevaluasi kinerja Woodpecker dalam pengaturan single-node, single-client, single-log-stream. Hasilnya sangat mengesankan jika dibandingkan dengan Kafka dan Pulsar:</p>
<table>
<thead>
<tr><th><strong>Sistem</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Lokal</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Throughput</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latensi</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Sebagai konteks, kami mengukur batas throughput teoretis dari berbagai backend penyimpanan yang berbeda pada mesin uji kami:</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>Sistem file lokal</strong>: 600-750 MB/s</p></li>
<li><p><strong>Amazon S3 (instance EC2 tunggal)</strong>: hingga 1,1 GB/s</p></li>
</ul>
<p>Hebatnya, Woodpecker secara konsisten mencapai 60-80% dari throughput maksimum yang mungkin dicapai untuk setiap backend - tingkat efisiensi yang luar biasa untuk middleware.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">Wawasan Kinerja Utama</h4><ol>
<li><p><strong>Mode Sistem File Lokal</strong>: Woodpecker mencapai 450 MB/s - 3,5 kali lebih cepat dari Kafka dan 4,2 kali lebih cepat dari Pulsar - dengan latensi sangat rendah hanya 1,8 ms, sehingga ideal untuk penerapan node tunggal berkinerja tinggi.</p></li>
<li><p><strong>Mode Penyimpanan Cloud (S3)</strong>: Saat menulis langsung ke S3, Woodpecker mencapai 750 MB/s (sekitar 68% dari batas teoretis S3), 5,8× lebih tinggi daripada Kafka dan 7× lebih tinggi daripada Pulsar. Meskipun latensi lebih tinggi (166 ms), pengaturan ini memberikan throughput yang luar biasa untuk beban kerja yang berorientasi pada batch.</p></li>
<li><p><strong>Mode Penyimpanan Objek (MinIO</strong>): Bahkan dengan MinIO, Woodpecker mencapai 71 MB/s-sekitar 65% dari kapasitas MinIO. Performa ini sebanding dengan Kafka dan Pulsar tetapi dengan kebutuhan sumber daya yang jauh lebih rendah.</p></li>
</ol>
<p>Woodpecker secara khusus dioptimalkan untuk penulisan bervolume tinggi secara bersamaan di mana menjaga ketertiban sangatlah penting. Dan hasil ini hanya mencerminkan tahap awal pengembangan-optimasi yang sedang berlangsung dalam penggabungan I/O, buffering cerdas, dan prefetching diharapkan dapat mendorong kinerja lebih dekat lagi ke batas teoritis.</p>
<h3 id="Design-Goals" class="common-anchor-header">Sasaran Desain</h3><p>Woodpecker menjawab tuntutan yang terus berkembang dari beban kerja pencarian vektor waktu nyata melalui persyaratan teknis utama ini:</p>
<ul>
<li><p>Konsumsi data throughput tinggi dengan ketekunan yang tahan lama di seluruh zona ketersediaan</p></li>
<li><p>Pembacaan ekor latensi rendah untuk langganan waktu nyata dan pembacaan catch-up throughput tinggi untuk pemulihan kegagalan</p></li>
<li><p>Backend penyimpanan yang dapat dicolokkan, termasuk penyimpanan objek cloud dan sistem file dengan dukungan protokol NFS</p></li>
<li><p>Opsi penerapan yang fleksibel, mendukung pengaturan mandiri yang ringan dan cluster berskala besar untuk penerapan Milvus multi-penyewa</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">Komponen Arsitektur</h3><p>Penerapan Woodpecker standar mencakup komponen-komponen berikut ini.</p>
<ul>
<li><p><strong>Klien</strong> - Lapisan antarmuka untuk mengeluarkan permintaan baca dan tulis</p></li>
<li><p><strong>LogStore</strong> - Mengelola buffering tulis berkecepatan tinggi, unggahan asinkron ke penyimpanan, dan pemadatan log</p></li>
<li><p><strong>Storage Backend</strong> - Mendukung layanan penyimpanan yang dapat diskalakan dan berbiaya rendah seperti S3, GCS, dan sistem file seperti EFS</p></li>
<li><p><strong>ETCD</strong> - Menyimpan metadata dan mengoordinasikan status log di seluruh node yang terdistribusi</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">Penerapan yang Fleksibel untuk Memenuhi Kebutuhan Spesifik Anda</h3><p>Woodpecker menawarkan dua mode penerapan yang sesuai dengan kebutuhan spesifik Anda:</p>
<p><strong>Mode MemoryBuffer - Ringan dan Bebas Perawatan</strong></p>
<p>Mode MemoryBuffer menyediakan opsi penerapan yang sederhana dan ringan di mana Woodpecker menyangga sementara penulisan yang masuk ke dalam memori dan secara berkala membuangnya ke layanan penyimpanan objek cloud. Metadata dikelola menggunakan etcd untuk memastikan konsistensi dan koordinasi. Mode ini paling cocok untuk beban kerja yang banyak dalam penerapan skala kecil atau lingkungan produksi yang memprioritaskan kesederhanaan daripada kinerja, terutama jika latensi tulis yang rendah tidak terlalu penting.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Mode memoryBuffer</em></p>
<p><strong>Mode QuorumBuffer - Dioptimalkan untuk Penerapan Latensi Rendah, Daya Tahan Tinggi</strong></p>
<p>Mode QuorumBuffer dirancang untuk beban kerja baca/tulis frekuensi tinggi yang sensitif terhadap latensi yang membutuhkan responsifitas waktu nyata dan toleransi kesalahan yang kuat. Dalam mode ini, Woodpecker berfungsi sebagai buffer tulis berkecepatan tinggi dengan penulisan kuorum tiga replika, memastikan konsistensi yang kuat dan ketersediaan yang tinggi.</p>
<p>Penulisan dianggap berhasil setelah direplikasi ke setidaknya dua dari tiga node, biasanya selesai dalam satu digit milidetik, setelah itu data secara asinkron ke penyimpanan objek cloud untuk daya tahan jangka panjang. Arsitektur ini meminimalkan status on-node, menghilangkan kebutuhan volume disk lokal yang besar, dan menghindari perbaikan anti-entropi yang rumit yang sering kali diperlukan dalam sistem berbasis kuorum tradisional.</p>
<p>Hasilnya adalah lapisan WAL yang ramping dan kuat yang ideal untuk lingkungan produksi yang sangat penting di mana konsistensi, ketersediaan, dan pemulihan yang cepat sangat penting.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar: Mode QuorumBuffer</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">Layanan Streaming: Dibangun untuk Aliran Data Waktu Nyata<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain Woodpecker, Milvus 2.6 memperkenalkan <strong>StreamingService-komponen</strong>khusus yang dirancang untuk manajemen log, konsumsi log, dan langganan data streaming.</p>
<p>Untuk memahami cara kerja arsitektur baru kami, penting untuk memperjelas hubungan antara kedua komponen ini:</p>
<ul>
<li><p><strong>Woodpecker</strong> adalah lapisan penyimpanan yang menangani persistensi aktual dari log yang ditulis sebelumnya, memberikan daya tahan dan keandalan</p></li>
<li><p><strong>StreamingService</strong> adalah lapisan layanan yang mengelola operasi log dan menyediakan kemampuan streaming data real-time</p></li>
</ul>
<p>Bersama-sama, keduanya membentuk pengganti yang lengkap untuk antrean pesan eksternal. Woodpecker menyediakan fondasi penyimpanan yang tahan lama, sementara StreamingService memberikan fungsionalitas tingkat tinggi yang berinteraksi dengan aplikasi secara langsung. Pemisahan masalah ini memungkinkan setiap komponen dioptimalkan untuk peran spesifiknya sambil bekerja sama dengan mulus sebagai sistem yang terintegrasi.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Menambahkan Layanan Streaming ke Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Layanan Streaming yang Ditambahkan dalam Arsitektur Milvus 2.6</p>
<p>Layanan Streaming terdiri dari tiga komponen inti:</p>
<p><strong>Koordinator Streaming</strong></p>
<ul>
<li><p>Menemukan Streaming Node yang tersedia dengan memantau sesi Milvus ETCD</p></li>
<li><p>Mengelola status WAL dan mengumpulkan metrik penyeimbangan beban melalui ManagerService</p></li>
</ul>
<p><strong>Klien Streaming</strong></p>
<ul>
<li><p>Meminta AssignmentService untuk menentukan distribusi segmen WAL di seluruh Streaming Node</p></li>
<li><p>Melakukan operasi baca/tulis melalui HandlerService pada Streaming Node yang sesuai</p></li>
</ul>
<p><strong>Streaming Node</strong></p>
<ul>
<li><p>Menangani operasi WAL yang sebenarnya dan menyediakan kemampuan publish-subscribe untuk streaming data real-time</p></li>
<li><p>Termasuk <strong>ManagerService</strong> untuk administrasi WAL dan pelaporan kinerja</p></li>
<li><p>Menampilkan <strong>HandlerService</strong> yang mengimplementasikan mekanisme publish-subscribe yang efisien untuk entri WAL</p></li>
</ul>
<p>Arsitektur berlapis ini memungkinkan Milvus untuk mempertahankan pemisahan yang jelas antara fungsionalitas streaming (berlangganan, pemrosesan waktu nyata) dan mekanisme penyimpanan yang sebenarnya. Woodpecker menangani "bagaimana" penyimpanan log, sementara StreamingService mengelola "apa" dan "kapan" operasi log.</p>
<p>Hasilnya, Streaming Service secara signifikan meningkatkan kemampuan real-time Milvus dengan memperkenalkan dukungan langganan asli, sehingga menghilangkan kebutuhan akan antrean pesan eksternal. Ini mengurangi konsumsi memori dengan mengkonsolidasikan cache yang sebelumnya diduplikasi dalam kueri dan jalur data, menurunkan latensi untuk pembacaan yang sangat konsisten dengan menghilangkan penundaan sinkronisasi asinkron, dan meningkatkan skalabilitas dan kecepatan pemulihan di seluruh sistem.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">Kesimpulan - Streaming pada Arsitektur Nol-Disk<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengelola state itu sulit. Sistem stateful sering kali mengorbankan elastisitas dan skalabilitas. Jawaban yang semakin diterima dalam desain cloud-native adalah memisahkan state dari komputasi-memungkinkan masing-masing untuk menskalakan secara independen.</p>
<p>Daripada menciptakan kembali roda, kami mendelegasikan kompleksitas penyimpanan yang tahan lama dan dapat diskalakan kepada tim teknik kelas dunia di balik layanan seperti AWS S3, Google Cloud Storage, dan MinIO. Di antara layanan tersebut, S3 menonjol karena kapasitasnya yang hampir tak terbatas, daya tahan hingga 99,99%, ketersediaan 99,99%, dan performa baca/tulis yang tinggi.</p>
<p>Namun, bahkan arsitektur "tanpa disk" pun memiliki kekurangan. Penyimpanan objek masih berjuang dengan latensi tulis yang tinggi dan inefisiensi file kecil - keterbatasan yang masih belum terselesaikan di banyak beban kerja waktu nyata.</p>
<p>Untuk basis data vektor - terutama yang mendukung RAG yang sangat penting, agen AI, dan beban kerja pencarian dengan latensi rendah - akses waktu nyata dan penulisan cepat tidak dapat dinegosiasikan. Itulah mengapa kami meneliti ulang Milvus di sekitar Woodpecker dan Layanan Streaming. Pergeseran ini menyederhanakan sistem secara keseluruhan (mari kita hadapi itu - tidak ada yang ingin mempertahankan tumpukan Pulsar penuh di dalam basis data vektor), memastikan data yang lebih segar, meningkatkan efisiensi biaya, dan mempercepat pemulihan kegagalan.</p>
<p>Kami percaya Woodpecker lebih dari sekadar komponen Milvus - Woodpecker dapat berfungsi sebagai blok bangunan dasar untuk sistem cloud-native lainnya. Seiring dengan perkembangan infrastruktur cloud, inovasi seperti S3 Express dapat membawa kita lebih dekat lagi pada kondisi ideal: daya tahan lintas-AZ dengan latensi tulis milidetik satu digit.</p>
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
    </button></h2><p>Milvus 2.6 sudah tersedia sekarang. Selain Woodpecker, Milvus 2.6 memperkenalkan lusinan fitur baru dan pengoptimalan kinerja seperti penyimpanan berjenjang, metode kuantisasi RabbitQ, dan pencarian teks lengkap yang disempurnakan serta multitenancy, yang secara langsung menjawab tantangan paling mendesak dalam pencarian vektor saat ini: penskalaan secara efisien sambil menjaga biaya tetap terkendali.</p>
<p>Siap menjelajahi semua yang ditawarkan Milvus? Selami<a href="https://milvus.io/docs/release_notes.md"> catatan rilis</a> kami, telusuri<a href="https://milvus.io/docs"> dokumentasi lengkapnya</a>, atau lihat<a href="https://milvus.io/blog"> blog fitur</a> kami.</p>
<p>Anda juga dapat bergabung dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas Discord</a> kami atau mengajukan masalah di<a href="https://github.com/milvus-io/milvus"> GitHub</a> - kami di sini untuk membantu Anda memaksimalkan Milvus 2.6.</p>
