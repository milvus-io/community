---
id: deep-dive-1-milvus-architecture-overview.md
title: Membangun Basis Data Vektor untuk Pencarian Kemiripan yang Dapat Diskalakan
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  Artikel pertama dari seri blog untuk melihat lebih dekat proses pemikiran dan
  prinsip-prinsip desain di balik pembuatan database vektor sumber terbuka yang
  paling populer.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh Xiaofan Luan dan disadur oleh Angela Ni dan Claire Yu.</p>
</blockquote>
<p>Menurut <a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">statistik</a>, sekitar 80%-90% data di dunia tidak terstruktur. Dipicu oleh pertumbuhan Internet yang cepat, ledakan data tidak terstruktur diperkirakan akan terjadi di tahun-tahun mendatang. Oleh karena itu, perusahaan-perusahaan sangat membutuhkan database yang kuat yang dapat membantu mereka menangani dan memahami data semacam itu dengan lebih baik. Namun, mengembangkan database selalu lebih mudah diucapkan daripada dilakukan. Artikel ini bertujuan untuk berbagi proses berpikir dan prinsip-prinsip desain dalam membangun Milvus, sebuah basis data vektor open-source yang berasal dari cloud untuk pencarian kemiripan yang dapat diskalakan. Artikel ini juga menjelaskan arsitektur Milvus secara detail.</p>
<p>Langsung ke:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">Data tidak terstruktur membutuhkan tumpukan perangkat lunak dasar yang lengkap</a><ul>
<li><a href="#Vectors-and-scalars">Vektor dan skalar</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">Dari mesin pencari vektor ke basis data vektor</a></li>
<li><a href="#A-cloud-native-first-approach">Pendekatan pertama yang asli cloud</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Prinsip-prinsip desain Milvus 2.0</a><ul>
<li><a href="#Log-as-data">Log sebagai data</a></li>
<li><a href="#Duality-of-table-and-log">Dualitas tabel dan log</a></li>
<li><a href="#Log-persistency">Persistensi log</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">Membangun basis data vektor untuk pencarian kemiripan yang dapat diskalakan</a><ul>
<li><a href="#Standalone-and-cluster">Standalone dan cluster</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Kerangka sederhana dari arsitektur Milvus</a></li>
<li><a href="#Data-Model">Model data</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Data yang tidak terstruktur membutuhkan perangkat lunak dasar yang lengkap<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Seiring dengan pertumbuhan dan perkembangan Internet, data yang tidak terstruktur menjadi semakin umum, termasuk email, dokumen, data sensor IoT, foto-foto di Facebook, struktur protein, dan masih banyak lagi. Agar komputer dapat memahami dan memproses data yang tidak terstruktur, data tersebut diubah menjadi vektor dengan menggunakan <a href="https://zilliz.com/learn/embedding-generation">teknik penyematan</a>.</p>
<p>Milvus menyimpan dan mengindeks vektor-vektor ini, dan menganalisis korelasi antara dua vektor dengan menghitung jarak kemiripannya. Jika dua vektor embedding sangat mirip, itu berarti sumber data asli juga mirip.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>Alur kerja pemrosesan data tidak terstruktur</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">Vektor dan skalar</h3><p>Skalar adalah kuantitas yang hanya dijelaskan dalam satu pengukuran - besaran. Skalar dapat direpresentasikan sebagai angka. Misalnya, sebuah mobil melaju dengan kecepatan 80 km/jam. Di sini, kecepatan (80 km/jam) adalah sebuah skalar. Sementara itu, vektor adalah kuantitas yang dijelaskan dalam setidaknya dua pengukuran - besar dan arah. Jika sebuah mobil melaju ke arah barat dengan kecepatan 80 km/jam, di sini kecepatan (80 km/jam ke arah barat) adalah sebuah vektor. Gambar di bawah ini adalah contoh skalar dan vektor yang umum.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>Skalar vs. Vektor</span> </span></p>
<p>Karena sebagian besar data penting memiliki lebih dari satu atribut, kita dapat memahami data ini dengan lebih baik jika kita mengubahnya menjadi vektor. Salah satu cara umum bagi kita untuk memanipulasi data vektor adalah dengan menghitung jarak antar vektor menggunakan <a href="https://milvus.io/docs/v2.0.x/metric.md">metrik</a> seperti jarak Euclidean, inner product, jarak Tanimoto, jarak Hamming, dll. Semakin dekat jaraknya, semakin mirip vektor tersebut. Untuk melakukan kueri terhadap kumpulan data vektor yang sangat besar secara efisien, kita dapat mengatur data vektor dengan membuat indeks. Setelah kumpulan data diindeks, kueri dapat diarahkan ke kluster, atau subset data, yang kemungkinan besar berisi vektor yang mirip dengan kueri masukan.</p>
<p>Untuk mempelajari lebih lanjut tentang indeks, lihat <a href="https://milvus.io/docs/v2.0.x/index.md">Indeks Vektor</a>.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">Dari mesin pencari vektor ke basis data vektor</h3><p>Sejak awal, Milvus 2.0 dirancang untuk tidak hanya berfungsi sebagai mesin pencari, namun yang lebih penting lagi, sebagai basis data vektor yang kuat.</p>
<p>Salah satu cara untuk membantu Anda memahami perbedaannya adalah dengan membuat analogi antara <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a> dan <a href="https://www.mysql.com/">MySQL</a>, atau <a href="https://lucene.apache.org/">Lucene</a> dan <a href="https://www.elastic.co/">Elasticsearch</a>.</p>
<p>Sama seperti MySQL dan Elasticsearch, Milvus juga dibangun di atas pustaka sumber terbuka seperti <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">HNSW</a>, <a href="https://github.com/spotify/annoy">Annoy</a>, yang berfokus pada penyediaan fungsionalitas pencarian dan memastikan kinerja pencarian. Namun, tidak adil jika Milvus hanya menjadi lapisan di atas Faiss karena Milvus menyimpan, mengambil, menganalisis vektor, dan, seperti halnya basis data lainnya, juga menyediakan antarmuka standar untuk operasi CRUD. Selain itu, Milvus juga memiliki fitur-fitur yang membanggakan, antara lain:</p>
<ul>
<li>Pemecahan dan partisi</li>
<li>Replikasi</li>
<li>Pemulihan bencana</li>
<li>Keseimbangan beban</li>
<li>Pengurai atau pengoptimal kueri</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>Basis data vektor</span> </span></p>
<p>Untuk pemahaman yang lebih komprehensif tentang apa itu basis data vektor, baca blognya <a href="https://zilliz.com/learn/what-is-vector-database">di sini</a>.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">Pendekatan pertama yang asli cloud</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Pendekatan yang bisa digunakan</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">Dari tidak ada yang dibagikan, ke penyimpanan bersama, lalu ke sesuatu yang dibagikan</h4><p>Basis data tradisional biasanya mengadopsi arsitektur "tidak ada yang dibagikan" di mana node dalam sistem terdistribusi bersifat independen namun terhubung dengan jaringan. Tidak ada memori atau penyimpanan yang dibagikan di antara node. Namun, <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a> merevolusi industri ini dengan memperkenalkan arsitektur "penyimpanan bersama" di mana komputasi (pemrosesan kueri) dipisahkan dari penyimpanan (penyimpanan basis data). Dengan arsitektur penyimpanan bersama, database dapat mencapai ketersediaan yang lebih besar, skalabilitas, dan pengurangan duplikasi data. Terinspirasi dari Snowflake, banyak perusahaan mulai memanfaatkan infrastruktur berbasis cloud untuk persistensi data sambil menggunakan penyimpanan lokal untuk caching. Jenis arsitektur database ini disebut "shared something" dan telah menjadi arsitektur utama di sebagian besar aplikasi saat ini.</p>
<p>Terlepas dari arsitektur "shared something", Milvus mendukung penskalaan yang fleksibel untuk setiap komponen dengan menggunakan Kubernetes untuk mengelola mesin eksekusinya dan memisahkan layanan baca, tulis, dan layanan lainnya dengan layanan mikro.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">Basis data sebagai layanan (DBaaS)</h4><p>Database sebagai layanan adalah tren yang sedang hangat karena banyak pengguna yang tidak hanya peduli dengan fungsionalitas database biasa tetapi juga mendambakan layanan yang lebih bervariasi. Ini berarti bahwa selain dari operasi CRUD tradisional, database kami harus memperkaya jenis layanan yang dapat disediakannya, seperti manajemen database, transportasi data, pengisian daya, visualisasi, dll.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">Bersinergi dengan ekosistem sumber terbuka yang lebih luas</h4><p>Tren lain dalam pengembangan basis data adalah memanfaatkan sinergi antara basis data dan infrastruktur cloud-native lainnya. Dalam kasus Milvus, ini bergantung pada beberapa sistem sumber terbuka. Sebagai contoh, Milvus menggunakan <a href="https://etcd.io/">etcd</a> untuk menyimpan metadata. Milvus juga mengadopsi antrean pesan, jenis komunikasi layanan-ke-layanan asinkron yang digunakan dalam arsitektur layanan mikro, yang dapat membantu mengekspor data tambahan.</p>
<p>Di masa mendatang, kami berharap dapat membangun Milvus di atas infrastruktur AI seperti <a href="https://spark.apache.org/">Spark</a> atau <a href="https://www.tensorflow.org/">Tensorflow</a>, dan mengintegrasikan Milvus dengan mesin streaming sehingga kami dapat mendukung pemrosesan aliran dan batch terpadu dengan lebih baik untuk memenuhi berbagai kebutuhan pengguna Milvus.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Prinsip-prinsip desain Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagai basis data vektor cloud-native generasi berikutnya, Milvus 2.0 dibangun berdasarkan tiga prinsip berikut.</p>
<h3 id="Log-as-data" class="common-anchor-header">Log sebagai data</h3><p>Sebuah log dalam sebuah basis data secara serial mencatat semua perubahan yang dilakukan pada data. Seperti yang ditunjukkan pada gambar di bawah ini, dari kiri ke kanan adalah &quot;data lama&quot; dan &quot;data baru&quot;. Dan log berada dalam urutan waktu. Milvus memiliki mekanisme pengatur waktu global yang memberikan satu stempel waktu yang unik secara global dan bertambah secara otomatis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>Log</span> </span></p>
<p>Dalam Milvus 2.0, log broker berfungsi sebagai tulang punggung sistem: semua operasi penyisipan dan pembaruan data harus melalui log broker, dan node pekerja mengeksekusi operasi CRUD dengan berlangganan dan mengonsumsi log.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">Dualitas tabel dan log</h3><p>Tabel dan log adalah data, dan keduanya hanyalah dua bentuk yang berbeda. Tabel adalah data yang terbatas, sedangkan log tidak terbatas. Log dapat dikonversi menjadi tabel. Dalam kasus Milvus, ia mengumpulkan log menggunakan jendela pemrosesan dari TimeTick. Berdasarkan urutan log, beberapa log digabungkan menjadi satu file kecil yang disebut snapshot log. Kemudian snapshot log ini digabungkan untuk membentuk segmen, yang dapat digunakan secara individual untuk keseimbangan beban.</p>
<h3 id="Log-persistency" class="common-anchor-header">Persistensi log</h3><p>Persistensi log adalah salah satu masalah rumit yang dihadapi oleh banyak database. Penyimpanan log dalam sistem terdistribusi biasanya bergantung pada algoritma replikasi.</p>
<p>Tidak seperti basis data seperti <a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a>, dan <a href="https://en.pingcap.com/">TiDB</a>, Milvus mengambil pendekatan terobosan dan memperkenalkan sistem publish-subscribe (pub/sub) untuk penyimpanan dan persistensi log. Sistem pub/sub analog dengan antrean pesan di <a href="https://kafka.apache.org/">Kafka</a> atau <a href="https://pulsar.apache.org/">Pulsar</a>. Semua node di dalam sistem dapat menggunakan log. Dalam Milvus, sistem semacam ini disebut log broker. Berkat log broker, log dipisahkan dari server, memastikan bahwa Milvus sendiri tidak memiliki status dan diposisikan dengan lebih baik untuk pulih dengan cepat dari kegagalan sistem.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>Pialang log</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">Membangun basis data vektor untuk pencarian kemiripan yang dapat diskalakan<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Dibangun di atas pustaka pencarian vektor populer termasuk Faiss, ANNOY, HNSW, dan banyak lagi, Milvus dirancang untuk pencarian kemiripan pada kumpulan data vektor yang padat yang berisi jutaan, miliaran, atau bahkan triliunan vektor.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">Standalone dan cluster</h3><p>Milvus menawarkan dua cara penerapan - standalone atau cluster. Pada Milvus standalone, karena semua node digunakan bersama-sama, kita dapat melihat Milvus sebagai satu proses tunggal. Saat ini, Milvus standalone bergantung pada MinIO dan etcd untuk persistensi data dan penyimpanan metadata. Dalam rilis mendatang, kami berharap dapat menghilangkan dua ketergantungan pihak ketiga ini untuk memastikan kesederhanaan sistem Milvus. Milvus cluster mencakup delapan komponen layanan mikro dan tiga ketergantungan pihak ketiga: MinIO, etcd, dan Pulsar. Pulsar berfungsi sebagai perantara log dan menyediakan layanan log pub/sub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>Standalone dan cluster</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Kerangka sederhana dari arsitektur Milvus</h3><p>Milvus memisahkan aliran data dari aliran kontrol, dan dibagi menjadi empat lapisan yang independen dalam hal skalabilitas dan pemulihan bencana.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Milvus</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">Lapisan akses</h4><p>Lapisan akses bertindak sebagai wajah sistem, mengekspos titik akhir koneksi klien ke dunia luar. Lapisan ini bertanggung jawab untuk memproses koneksi klien, melakukan verifikasi statis, pemeriksaan dinamis dasar untuk permintaan pengguna, meneruskan permintaan, dan mengumpulkan serta mengembalikan hasil ke klien. Proksi itu sendiri tidak memiliki kewarganegaraan dan menyediakan alamat akses dan layanan terpadu ke dunia luar melalui komponen penyeimbang beban (Nginx, Kubernetess Ingress, NodePort, dan LVS). Milvus menggunakan arsitektur pemrosesan paralel masif (MPP), di mana proksi mengembalikan hasil yang dikumpulkan dari node pekerja setelah agregasi global dan pasca-pemrosesan.</p>
<h4 id="Coordinator-service" class="common-anchor-header">Layanan koordinator</h4><p>Layanan koordinator adalah otak dari sistem, yang bertanggung jawab atas manajemen node topologi cluster, penyeimbangan beban, pembuatan stempel waktu, deklarasi data, dan manajemen data. Untuk penjelasan rinci tentang fungsi setiap layanan koordinator, baca <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">dokumentasi teknis Milvus</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">Node pekerja</h4><p>Node pekerja, atau eksekusi, bertindak sebagai anggota tubuh sistem, mengeksekusi instruksi yang dikeluarkan oleh layanan koordinator dan perintah bahasa manipulasi data (DML) yang diinisiasi oleh proksi. Node pekerja di Milvus mirip dengan node data di <a href="https://hadoop.apache.org/">Hadoop</a>, atau server wilayah di HBase. Setiap jenis simpul pekerja berhubungan dengan sebuah layanan coord. Untuk penjelasan rinci tentang fungsi setiap node pekerja, baca <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">dokumentasi teknis Milvus</a>.</p>
<h4 id="Storage" class="common-anchor-header">Penyimpanan</h4><p>Penyimpanan adalah landasan Milvus, yang bertanggung jawab atas persistensi data. Lapisan penyimpanan dibagi menjadi tiga bagian:</p>
<ul>
<li><strong>Penyimpanan meta:</strong> Bertanggung jawab untuk menyimpan snapshot dari meta data seperti skema koleksi, status node, pos pemeriksaan konsumsi pesan, dll. Milvus mengandalkan etcd untuk fungsi-fungsi ini dan Etcd juga mengemban tanggung jawab untuk registrasi layanan dan pemeriksaan kesehatan.</li>
<li><strong>Pialang log:</strong> Pub/sub sistem yang mendukung pemutaran dan bertanggung jawab untuk persistensi data streaming, eksekusi kueri asinkron yang andal, pemberitahuan peristiwa, dan mengembalikan hasil kueri. Ketika node melakukan pemulihan waktu henti, log broker memastikan integritas data tambahan melalui pemutaran log broker. Cluster Milvus menggunakan Pulsar sebagai log broker, sedangkan mode mandiri menggunakan RocksDB. Layanan penyimpanan streaming seperti Kafka dan Pravega juga dapat digunakan sebagai log broker.</li>
<li><strong>Penyimpanan objek:</strong> Menyimpan file snapshot dari log, file indeks skalar/vektor, dan hasil pemrosesan kueri perantara. Milvus mendukung <a href="https://aws.amazon.com/s3/">AWS S3</a> dan <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a>, serta <a href="https://min.io/">MinIO</a>, sebuah layanan penyimpanan objek sumber terbuka yang ringan. Karena latensi akses yang tinggi dan penagihan per kueri dari layanan penyimpanan objek, Milvus akan segera mendukung kumpulan cache berbasis memori/SSD dan pemisahan data panas/dingin untuk meningkatkan kinerja dan mengurangi biaya.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">Model Data</h3><p>Model data mengatur data dalam database. Di Milvus, semua data diatur berdasarkan koleksi, pecahan, partisi, segmen, dan entitas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>Model data 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">Koleksi</h4><p>Koleksi dalam Milvus dapat diibaratkan sebagai sebuah tabel dalam sistem penyimpanan relasional. Collection adalah unit data terbesar dalam Milvus.</p>
<h4 id="Shard" class="common-anchor-header">Shard</h4><p>Untuk mengambil keuntungan penuh dari kekuatan komputasi paralel dari cluster ketika menulis data, koleksi di Milvus harus menyebarkan operasi penulisan data ke node yang berbeda. Secara default, satu koleksi berisi dua pecahan. Bergantung pada volume kumpulan data Anda, Anda dapat memiliki lebih banyak pecahan dalam sebuah koleksi. Milvus menggunakan metode hashing kunci utama untuk sharding.</p>
<h4 id="Partition" class="common-anchor-header">Partisi</h4><p>Ada juga beberapa partisi dalam sebuah pecahan. Partisi dalam Milvus mengacu pada sekumpulan data yang ditandai dengan label yang sama dalam sebuah koleksi. Metode partisi yang umum termasuk partisi berdasarkan tanggal, jenis kelamin, usia pengguna, dan banyak lagi. Membuat partisi dapat menguntungkan proses kueri karena data yang sangat banyak dapat disaring berdasarkan tag partisi.</p>
<p>Sebagai perbandingan, sharding lebih pada kemampuan penskalaan saat menulis data, sedangkan partisi lebih pada peningkatan kinerja sistem saat membaca data.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>Model data 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">Segmen</h4><p>Di dalam setiap partisi, terdapat beberapa segmen kecil. Segmen adalah unit terkecil untuk penjadwalan sistem di Milvus. Ada dua jenis segmen, yaitu segmen yang sedang tumbuh dan segmen yang tertutup. Segmen yang tumbuh dilanggan oleh simpul-simpul kueri. Pengguna Milvus terus menulis data ke dalam segmen yang sedang tumbuh. Ketika ukuran segmen yang sedang tumbuh mencapai batas atas (512 MB secara default), sistem tidak akan mengizinkan penulisan data tambahan ke dalam segmen yang sedang tumbuh ini, dan karenanya menyegel segmen ini. Indeks dibangun di atas segmen yang disegel.</p>
<p>Untuk mengakses data secara real time, sistem membaca data di segmen yang sedang tumbuh dan segmen yang disegel.</p>
<h4 id="Entity" class="common-anchor-header">Entitas</h4><p>Setiap segmen berisi sejumlah besar entitas. Entitas di Milvus setara dengan sebuah baris dalam database tradisional. Setiap entitas memiliki bidang kunci utama yang unik, yang juga dapat dibuat secara otomatis. Entitas juga harus mengandung timestamp (ts), dan bidang vektor - inti dari Milvus.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Tentang Seri Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">pengumuman resmi ketersediaan umum</a> Milvus 2.0, kami menyusun seri blog Milvus Deep Dive ini untuk memberikan interpretasi mendalam tentang arsitektur dan kode sumber Milvus. Topik-topik yang dibahas dalam seri blog ini meliputi:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Gambaran umum arsitektur Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API dan SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Pemrosesan data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Manajemen data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Kueri waktu nyata</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Mesin eksekusi skalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistem QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Mesin eksekusi vektor</a></li>
</ul>
