---
id: mishards-distributed-vector-search-milvus.md
title: Gambaran umum arsitektur terdistribusi
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: Bagaimana cara meningkatkan skala
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Pencarian Vektor Terdistribusi di Milvus</custom-h1><p>Milvus bertujuan untuk mencapai pencarian kemiripan dan analisis yang efisien untuk vektor berskala besar. Instance Milvus mandiri dapat dengan mudah menangani pencarian vektor untuk vektor berskala miliaran. Namun, untuk 10 miliar, 100 miliar, atau bahkan set data yang lebih besar, diperlukan cluster Milvus. Cluster ini dapat digunakan sebagai instance mandiri untuk aplikasi tingkat atas dan dapat memenuhi kebutuhan bisnis dengan latensi rendah dan konkurensi tinggi untuk data berskala besar. Cluster Milvus dapat mengirim ulang permintaan, memisahkan pembacaan dan penulisan, skala secara horizontal, dan berkembang secara dinamis, sehingga menyediakan instance Milvus yang dapat berkembang tanpa batas. Mishards adalah solusi terdistribusi untuk Milvus.</p>
<p>Artikel ini akan memperkenalkan secara singkat komponen-komponen arsitektur Mishards. Informasi yang lebih rinci akan diperkenalkan di artikel-artikel selanjutnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Gambaran umum arsitektur terdistribusi<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-gambaran-arsitektur-terdistribusi.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">Penelusuran layanan<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-penelusuran-layanan-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">Komponen layanan utama<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>Kerangka kerja penemuan layanan, seperti ZooKeeper, etcd, dan Consul.</li>
<li>Penyeimbang beban, seperti Nginx, HAProxy, Ingress Controller.</li>
<li>Simpul Mishards: tanpa kewarganegaraan, dapat diskalakan.</li>
<li>Node Milvus yang hanya dapat ditulis: simpul tunggal dan tidak dapat diskalakan. Anda perlu menggunakan solusi ketersediaan tinggi untuk simpul ini untuk menghindari titik kegagalan tunggal.</li>
<li>Simpul Milvus hanya-baca: Simpul yang dapat diatur dan dapat diskalakan.</li>
<li>Layanan penyimpanan bersama: Semua node Milvus menggunakan layanan penyimpanan bersama untuk berbagi data, seperti NAS atau NFS.</li>
<li>Layanan metadata: Semua node Milvus menggunakan layanan ini untuk berbagi metadata. Saat ini, hanya MySQL yang didukung. Layanan ini membutuhkan solusi ketersediaan tinggi MySQL.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Komponen yang dapat diskalakan<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>Kesalahan</li>
<li>Node Milvus hanya-baca</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Pengenalan komponen<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Node Mishards</strong></p>
<p>Mishards bertanggung jawab untuk memecah permintaan hulu dan merutekan sub-permintaan ke sub-layanan. Hasilnya dirangkum untuk dikembalikan ke hulu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-mishards-nodes.jpg</span> </span></p>
<p>Seperti yang ditunjukkan pada bagan di atas, setelah menerima permintaan pencarian TopK, Mishards pertama-tama memecah permintaan menjadi sub-permintaan dan mengirim sub-permintaan ke layanan hilir. Ketika semua sub-respon dikumpulkan, sub-respon digabungkan dan dikembalikan ke hulu.</p>
<p>Karena Mishards adalah layanan tanpa nama, layanan ini tidak menyimpan data atau berpartisipasi dalam komputasi yang rumit. Dengan demikian, node tidak memiliki persyaratan konfigurasi yang tinggi dan daya komputasi terutama digunakan dalam penggabungan sub-hasil. Jadi, dimungkinkan untuk meningkatkan jumlah node Mishards untuk konkurensi yang tinggi.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Node Milvus<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus node bertanggung jawab atas operasi inti terkait CRUD, sehingga memiliki persyaratan konfigurasi yang relatif tinggi. Pertama, ukuran memori harus cukup besar untuk menghindari terlalu banyak operasi IO disk. Kedua, konfigurasi CPU juga dapat memengaruhi kinerja. Seiring dengan bertambahnya ukuran cluster, semakin banyak node Milvus yang dibutuhkan untuk meningkatkan throughput sistem.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Node yang hanya dapat dibaca dan node yang dapat ditulis</h3><ul>
<li>Operasi inti dari Milvus adalah penyisipan vektor dan pencarian. Pencarian memiliki persyaratan yang sangat tinggi pada konfigurasi CPU dan GPU, sementara penyisipan atau operasi lainnya memiliki persyaratan yang relatif rendah. Memisahkan node yang menjalankan pencarian dari node yang menjalankan operasi lainnya akan menghasilkan penyebaran yang lebih ekonomis.</li>
<li>Dalam hal kualitas layanan, ketika sebuah node melakukan operasi pencarian, perangkat keras terkait berjalan dengan beban penuh dan tidak dapat memastikan kualitas layanan operasi lainnya. Oleh karena itu, dua jenis node digunakan. Permintaan pencarian diproses oleh node read-only dan permintaan lainnya diproses oleh node writable.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">Hanya satu simpul yang dapat ditulis yang diperbolehkan</h3><ul>
<li><p>Saat ini, Milvus tidak mendukung berbagi data untuk beberapa instance yang dapat ditulis.</p></li>
<li><p>Selama penerapan, satu titik kegagalan dari node yang dapat ditulis perlu dipertimbangkan. Solusi ketersediaan tinggi perlu disiapkan untuk node yang dapat ditulis.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Skalabilitas node hanya-baca</h3><p>Jika ukuran data sangat besar, atau persyaratan latensi sangat tinggi, Anda dapat menskalakan node read-only secara horizontal sebagai stateful node. Asumsikan ada 4 host dan masing-masing memiliki konfigurasi sebagai berikut: Inti CPU: 16, GPU: 1, Memori: 64 GB. Bagan berikut menunjukkan cluster ketika menskalakan stateful node secara horizontal. Baik daya komputasi dan memori meningkat secara linear. Data dibagi menjadi 8 pecahan dengan setiap node memproses permintaan dari 2 pecahan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-skalabilitas-simpul-hanya-baca-milvus.png</span> </span></p>
<p>Ketika jumlah permintaan besar untuk beberapa pecahan, node read-only tanpa nama dapat digunakan untuk pecahan ini untuk meningkatkan throughput. Ambil host di atas sebagai contoh. ketika host digabungkan menjadi cluster tanpa server, daya komputasi meningkat secara linear. Karena data yang akan diproses tidak bertambah, daya pemrosesan untuk pecahan data yang sama juga meningkat secara linear.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-skalabilitas-simpul-hanya-baca-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">Layanan metadata</h3><p>Kata kunci: MySQL</p>
<p>Untuk informasi lebih lanjut tentang metadata Milvus, lihat Cara melihat metadata. Dalam sistem terdistribusi, node yang dapat ditulis Milvus adalah satu-satunya penghasil metadata. Node Mishards, node yang dapat ditulis Milvus, dan node yang hanya dapat dibaca Milvus adalah konsumen metadata. Saat ini, Milvus hanya mendukung MySQL dan SQLite sebagai backend penyimpanan metadata. Dalam sistem terdistribusi, layanan ini hanya dapat digunakan sebagai MySQL yang sangat tersedia.</p>
<h3 id="Service-discovery" class="common-anchor-header">Penemuan layanan</h3><p>Kata kunci: Apache Zookeeper, etcd, Konsul, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-penemuan-layanan.png</span> </span></p>
<p>Penemuan layanan menyediakan informasi tentang semua node Milvus. Node Milvus mendaftarkan informasi mereka saat online dan keluar saat offline. Node Milvus juga dapat mendeteksi node yang tidak normal dengan memeriksa status kesehatan layanan secara berkala.</p>
<p>Penemuan layanan berisi banyak kerangka kerja, termasuk etcd, Consul, ZooKeeper, dll. Mishards mendefinisikan antarmuka penemuan layanan dan menyediakan kemungkinan untuk penskalaan dengan plugin. Saat ini, Mishards menyediakan dua jenis plugin, yang sesuai dengan cluster Kubernetes dan konfigurasi statis. Anda dapat menyesuaikan penemuan layanan Anda sendiri dengan mengikuti implementasi plugin ini. Antarmuka bersifat sementara dan perlu didesain ulang. Informasi lebih lanjut tentang menulis plugin Anda sendiri akan diuraikan dalam artikel mendatang.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Penyeimbangan beban dan pemecahan layanan</h3><p>Kata kunci: Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-penyeimbangan-beban-dan-pemecahan-layanan.png</span> </span></p>
<p>Penemuan layanan dan penyeimbangan beban digunakan secara bersamaan. Penyeimbangan beban dapat dikonfigurasikan sebagai polling, hashing, atau hashing yang konsisten.</p>
<p>Penyeimbang beban bertanggung jawab untuk mengirim ulang permintaan pengguna ke simpul Mishards.</p>
<p>Setiap node Mishards memperoleh informasi dari semua node Milvus hilir melalui pusat penemuan layanan. Semua metadata terkait dapat diperoleh dengan layanan metadata. Mishards mengimplementasikan sharding dengan mengonsumsi sumber daya ini. Mishards mendefinisikan antarmuka yang terkait dengan strategi perutean dan menyediakan ekstensi melalui plugin. Saat ini, Mishards menyediakan strategi hashing yang konsisten berdasarkan tingkat segmen terendah. Seperti yang ditunjukkan pada bagan, ada 10 segmen, s1 hingga s10. Sesuai dengan strategi hashing konsisten berbasis segmen, Mishards merutekan permintaan yang berkaitan dengan s1, 24, s6, dan s9 ke node Milvus 1, s2, s3, s5 ke node Milvus 2, dan s7, s8, s10 ke node Milvus 3.</p>
<p>Berdasarkan kebutuhan bisnis Anda, Anda dapat menyesuaikan perutean dengan mengikuti plugin perutean hashing yang konsisten secara default.</p>
<h3 id="Tracing" class="common-anchor-header">Penelusuran</h3><p>Kata kunci: OpenTracing, Jaeger, Zipkin</p>
<p>Mengingat kompleksitas sistem terdistribusi, permintaan dikirim ke beberapa pemanggilan layanan internal. Untuk membantu menemukan masalah, kita perlu menelusuri rantai pemanggilan layanan internal. Seiring dengan meningkatnya kompleksitas, manfaat dari sistem penelusuran yang tersedia sudah cukup jelas. Kami memilih standar CNCF OpenTracing. OpenTracing menyediakan API yang tidak bergantung pada platform dan vendor bagi para pengembang untuk mengimplementasikan sistem penelusuran dengan mudah.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>Bagan sebelumnya adalah contoh penelusuran selama pemanggilan pencarian. Pencarian memanggil <code translate="no">get_routing</code>, <code translate="no">do_search</code>, dan <code translate="no">do_merge</code> secara berurutan. <code translate="no">do_search</code> juga memanggil <code translate="no">search_127.0.0.1</code>.</p>
<p>Seluruh catatan penelusuran membentuk pohon berikut ini:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-penelusuran-penelusuran-milvus.png</span> </span></p>
<p>Bagan berikut ini menunjukkan contoh info permintaan/respon dan tag dari setiap simpul:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>OpenTracing telah diintegrasikan ke Milvus. Informasi lebih lanjut akan dibahas dalam artikel mendatang.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Pemantauan dan peringatan</h3><p>Kata kunci: Prometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-pemantauan-peringatan-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagai middleware layanan, Mishards mengintegrasikan penemuan layanan, permintaan perutean, penggabungan hasil, dan penelusuran. Perluasan berbasis plugin juga disediakan. Saat ini, solusi terdistribusi berdasarkan Mishards masih memiliki beberapa kekurangan:</p>
<ul>
<li>Mishards menggunakan proxy sebagai lapisan tengah dan memiliki biaya latensi.</li>
<li>Node yang dapat ditulis Milvus adalah layanan satu titik.</li>
<li>Bergantung pada layanan MySQL yang sangat tersedia. -Penyebarannya rumit jika ada beberapa shard dan satu shard memiliki banyak salinan.</li>
<li>Tidak memiliki lapisan cache, seperti akses ke metadata.</li>
</ul>
<p>Kami akan memperbaiki masalah-masalah yang diketahui ini di versi mendatang sehingga Mishards dapat diterapkan ke lingkungan produksi dengan lebih nyaman.</p>
