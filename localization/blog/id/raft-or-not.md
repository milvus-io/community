---
id: raft-or-not.md
title: >-
  Rakit atau tidak? Solusi Terbaik untuk Konsistensi Data dalam Database
  Cloud-native
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: >-
  Mengapa algoritma replikasi berbasis konsensus bukanlah solusi terbaik untuk
  mencapai konsistensi data dalam basis data terdistribusi?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/xiaofan-luan">Xiaofan Luan</a> dan disadur oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Replikasi berbasis konsensus adalah strategi yang diadopsi secara luas di banyak basis data terdistribusi yang berasal dari cloud. Namun, strategi ini memiliki beberapa kekurangan dan jelas bukan solusi yang tepat.</p>
<p>Tulisan ini bertujuan untuk pertama-tama menjelaskan konsep replikasi, konsistensi, dan konsensus dalam basis data cloud-native dan terdistribusi, kemudian mengklarifikasi mengapa algoritme berbasis konsensus seperti Paxos dan Raft bukanlah peluru perak, dan akhirnya mengusulkan <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">solusi untuk replikasi berbasis konsensus</a>.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">Memahami replikasi, konsistensi, dan konsensus</a></li>
<li><a href="#Consensus-based-replication">Replikasi berbasis konsensus</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">Strategi replikasi log untuk basis data cloud-native dan terdistribusi</a></li>
<li><a href="#Summary">Ringkasan</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">Memahami replikasi, konsistensi, dan konsensus<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum mendalami pro dan kontra Paxos dan Raft, serta mengusulkan strategi replikasi log yang paling sesuai, kita perlu terlebih dahulu mengungkap konsep replikasi, konsistensi, dan konsensus.</p>
<p>Perhatikan bahwa artikel ini terutama berfokus pada sinkronisasi data/log tambahan. Oleh karena itu, ketika berbicara tentang replikasi data/log, yang dimaksud adalah replikasi data tambahan, bukan data historis.</p>
<h3 id="Replication" class="common-anchor-header">Replikasi</h3><p>Replikasi adalah proses membuat beberapa salinan data dan menyimpannya di disk, proses, mesin, cluster, dll yang berbeda, dengan tujuan untuk meningkatkan keandalan data dan mempercepat kueri data. Karena dalam replikasi, data disalin dan disimpan di beberapa lokasi, data lebih dapat diandalkan dalam menghadapi pemulihan dari kegagalan disk, kegagalan mesin fisik, atau kesalahan cluster. Selain itu, beberapa replika data dapat meningkatkan kinerja database terdistribusi dengan sangat mempercepat kueri.</p>
<p>Ada berbagai mode replikasi, seperti replikasi sinkron / asinkron, replikasi dengan konsistensi yang kuat / bertahap, replikasi pemimpin-pengikut / terdesentralisasi. Pilihan mode replikasi berpengaruh pada ketersediaan dan konsistensi sistem. Oleh karena itu, seperti yang diusulkan dalam <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">teorema CAP</a> yang terkenal, seorang arsitek sistem perlu menukar antara konsistensi dan ketersediaan ketika partisi jaringan tidak dapat dihindari.</p>
<h3 id="Consistency" class="common-anchor-header">Konsistensi</h3><p>Singkatnya, konsistensi dalam database terdistribusi mengacu pada properti yang memastikan setiap node atau replika memiliki tampilan data yang sama ketika menulis atau membaca data pada waktu tertentu. Untuk daftar lengkap tingkat konsistensi, baca dokumennya <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">di sini</a>.</p>
<p>Untuk memperjelas, di sini kita berbicara tentang konsistensi seperti dalam teorema CAP, bukan ACID (atomisitas, konsistensi, isolasi, daya tahan). Konsistensi dalam teorema CAP mengacu pada setiap node dalam sistem yang memiliki data yang sama, sedangkan konsistensi dalam ACID mengacu pada satu node yang memberlakukan aturan yang sama pada setiap komit yang potensial.</p>
<p>Umumnya, database OLTP (pemrosesan transaksi online) membutuhkan konsistensi yang kuat atau linearitas untuk memastikan hal tersebut:</p>
<ul>
<li>Setiap pembacaan dapat mengakses data terbaru yang dimasukkan.</li>
<li>Jika nilai baru dikembalikan setelah pembacaan, semua pembacaan berikutnya, terlepas dari klien yang sama atau berbeda, harus mengembalikan nilai baru.</li>
</ul>
<p>Inti dari linearitas adalah untuk menjamin kemutakhiran beberapa replika data - setelah nilai baru ditulis atau dibaca, semua pembacaan berikutnya dapat melihat nilai baru tersebut hingga nilai tersebut ditimpa. Sistem terdistribusi yang menyediakan linearitas dapat menyelamatkan pengguna dari kesulitan mengawasi beberapa replika, dan dapat menjamin atomisitas dan urutan atau setiap operasi.</p>
<h3 id="Consensus" class="common-anchor-header">Konsensus</h3><p>Konsep konsensus diperkenalkan pada sistem terdistribusi karena pengguna ingin melihat sistem terdistribusi bekerja dengan cara yang sama seperti sistem mandiri.</p>
<p>Sederhananya, konsensus adalah kesepakatan umum tentang nilai. Sebagai contoh, Steve dan Frank ingin mencari makanan. Steve menyarankan untuk makan sandwich. Frank setuju dengan saran Steve dan mereka berdua makan sandwich. Mereka mencapai sebuah konsensus. Lebih spesifiknya, sebuah nilai (sandwich) yang diusulkan oleh salah satu dari mereka disetujui oleh keduanya, dan keduanya mengambil tindakan berdasarkan nilai tersebut. Demikian pula, konsensus dalam sistem terdistribusi berarti ketika sebuah proses mengusulkan sebuah nilai, semua proses lainnya dalam sistem menyetujui dan bertindak berdasarkan nilai ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>Konsensus</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">Replikasi berbasis konsensus<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>Algoritma berbasis konsensus yang paling awal diusulkan bersama dengan <a href="https://pmg.csail.mit.edu/papers/vr.pdf">replikasi</a> berbasis <a href="https://pmg.csail.mit.edu/papers/vr.pdf">cap</a> pada tahun 1988. Pada tahun 1989, Leslie Lamport mengusulkan <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a>, sebuah algoritme berbasis konsensus.</p>
<p>Dalam beberapa tahun terakhir, kita menyaksikan algoritme berbasis konsensus lain yang lazim di industri ini - <a href="https://raft.github.io/">Raft</a>. Algoritma ini telah diadopsi oleh banyak database NewSQL utama seperti CockroachDB, TiDB, OceanBase, dll.</p>
<p>Perlu dicatat, sistem terdistribusi tidak selalu mendukung linearitas meskipun sistem tersebut mengadopsi replikasi berbasis konsensus. Namun, linearitas adalah prasyarat untuk membangun basis data terdistribusi ACID.</p>
<p>Ketika mendesain sistem basis data, urutan komit dari log dan state machine harus dipertimbangkan. Kehati-hatian ekstra juga diperlukan untuk mempertahankan leader lease dari Paxos atau Raft dan mencegah terjadinya split-brain dalam partisi jaringan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Mesin status replikasi rakit</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">Pro dan kontra</h3><p>Memang, Raft, ZAB, dan <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">protokol log berbasis kuorum</a> di Aurora adalah variasi Paxos. Replikasi berbasis konsensus memiliki keuntungan sebagai berikut:</p>
<ol>
<li>Meskipun replikasi berbasis konsensus lebih berfokus pada konsistensi dan partisi jaringan dalam teorema CAP, replikasi ini memberikan ketersediaan yang relatif lebih baik dibandingkan dengan replikasi pemimpin-pengikut tradisional.</li>
<li>Raft merupakan terobosan yang sangat menyederhanakan algoritme berbasis konsensus. Dan ada banyak pustaka Raft yang bersifat open-source di GitHub (Misalnya <a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>).</li>
<li>Kinerja replikasi berbasis konsensus dapat memuaskan sebagian besar aplikasi dan bisnis. Dengan cakupan SSD berkinerja tinggi dan NIC (kartu antarmuka jaringan) gigabyte, beban untuk menyinkronkan beberapa replika menjadi berkurang, menjadikan algoritme Paxos dan Raft sebagai yang utama dalam industri ini.</li>
</ol>
<p>Salah satu kesalahpahaman adalah bahwa replikasi berbasis konsensus adalah peluru perak untuk mencapai konsistensi data dalam basis data terdistribusi. Akan tetapi, hal ini tidak benar. Tantangan dalam ketersediaan, kompleksitas, dan kinerja yang dihadapi oleh algoritme berbasis konsensus menghalanginya untuk menjadi solusi yang sempurna.</p>
<ol>
<li><p>Ketersediaan yang dikompromikan Algoritma Paxos atau Raft yang dioptimalkan memiliki ketergantungan yang kuat pada replika pemimpin, yang datang dengan kemampuan yang lemah untuk melawan kegagalan abu-abu. Dalam replikasi berbasis konsensus, pemilihan replika pemimpin yang baru tidak akan dilakukan sampai node pemimpin tidak merespons untuk waktu yang lama. Oleh karena itu, replikasi berbasis konsensus tidak mampu menangani situasi di mana leader node lambat atau terjadi perebutan.</p></li>
<li><p>Kompleksitas tinggi Meskipun sudah ada banyak algoritme yang diperluas berdasarkan Paxos dan Raft, kemunculan <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a> dan <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Raft</a> membutuhkan lebih banyak pertimbangan dan pengujian pada sinkronisasi antara log dan state machine.</p></li>
<li><p>Performa yang dikompromikan Di era cloud-native, penyimpanan lokal digantikan oleh solusi penyimpanan bersama seperti EBS dan S3 untuk memastikan keandalan dan konsistensi data. Akibatnya, replikasi berbasis konsensus tidak lagi menjadi keharusan untuk sistem terdistribusi. Terlebih lagi, replikasi berbasis konsensus memiliki masalah redundansi data karena solusi dan EBS memiliki banyak replika.</p></li>
</ol>
<p>Untuk replikasi multi-pusat data dan multi-cloud, pengejaran konsistensi tidak hanya mengorbankan ketersediaan tetapi juga <a href="https://en.wikipedia.org/wiki/PACELC_theorem">latensi</a>, yang mengakibatkan penurunan kinerja. Oleh karena itu, linearitas bukanlah suatu keharusan untuk toleransi bencana multi-datacenter di sebagian besar aplikasi.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">Strategi replikasi log untuk basis data cloud-native dan terdistribusi<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Tidak dapat disangkal, algoritme berbasis konsensus seperti Raft dan Paxos masih menjadi algoritme utama yang diadopsi oleh banyak database OLTP. Namun, dengan mengamati contoh protokol <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>, <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a>, dan <a href="https://rockset.com/">Rockset</a>, kita dapat melihat trennya bergeser.</p>
<p>Ada dua prinsip utama untuk solusi yang dapat melayani database terdistribusi cloud-native dengan baik.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. Replikasi sebagai layanan</h3><p>Diperlukan layanan mikro terpisah yang didedikasikan untuk sinkronisasi data. Modul sinkronisasi dan modul penyimpanan tidak boleh lagi digabungkan secara erat dalam proses yang sama.</p>
<p>Sebagai contoh, Socrates memisahkan penyimpanan, log, dan komputasi. Ada satu layanan log khusus (layanan XLog di tengah-tengah gambar di bawah).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Socrates</span> </span></p>
<p>Layanan XLog adalah layanan individual. Persistensi data dicapai dengan bantuan penyimpanan latensi rendah. Zona pendaratan di Socrates bertugas menyimpan tiga replika dengan kecepatan yang dipercepat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Layanan Socrates XLog</span> </span></p>
<p>Simpul pemimpin mendistribusikan log ke broker log secara asinkron, dan mengirimkan data ke Xstore. Cache SSD lokal dapat mempercepat pembacaan data. Setelah flush data berhasil, buffer di zona pendaratan dapat dibersihkan. Jelas, semua data log dibagi menjadi tiga lapisan - zona pendaratan, SSD lokal, dan XStore.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. Prinsip boneka Rusia</h3><p>Salah satu cara untuk mendesain sistem adalah dengan mengikuti prinsip boneka Rusia: setiap lapisan sudah lengkap dan sesuai dengan apa yang dilakukan oleh lapisan tersebut sehingga lapisan lain dapat dibangun di atas atau di sekitarnya.</p>
<p>Ketika merancang database cloud-native, kita perlu secara cerdik memanfaatkan layanan pihak ketiga lainnya untuk mengurangi kerumitan arsitektur sistem.</p>
<p>Sepertinya kita tidak bisa menyiasati Paxos untuk menghindari kegagalan satu titik. Namun, kita masih dapat menyederhanakan replikasi log dengan menyerahkan pemilihan pemimpin ke layanan Raft atau Paxos berdasarkan <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a>, dan <a href="https://etcd.io/">etcd</a>.</p>
<p>Sebagai contoh, arsitektur <a href="https://rockset.com/">Rockset</a> mengikuti prinsip boneka Rusia dan menggunakan Kafka/Kineses untuk log terdistribusi, S3 untuk penyimpanan, dan cache SSD lokal untuk meningkatkan kinerja kueri.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Rockset</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">Pendekatan Milvus</h3><p>Konsistensi yang dapat disetel dalam Milvus sebenarnya mirip dengan pembacaan pengikut dalam replikasi berbasis konsensus. Fitur pembacaan pengikut mengacu pada penggunaan replika pengikut untuk melakukan tugas pembacaan data di bawah premis konsistensi yang kuat. Tujuannya adalah untuk meningkatkan throughput cluster dan mengurangi beban pada leader. Mekanisme di balik fitur follower read adalah menanyakan indeks komit dari log terbaru dan menyediakan layanan kueri hingga semua data dalam indeks komit diterapkan ke state machine.</p>
<p>Namun, desain Milvus tidak mengadopsi strategi follower. Dengan kata lain, Milvus tidak menanyakan indeks komit setiap kali menerima permintaan kueri. Sebagai gantinya, Milvus mengadopsi mekanisme seperti tanda air di <a href="https://flink.apache.org/">Flink</a>, yang memberi tahu simpul kueri lokasi indeks komit pada interval yang teratur. Alasan untuk mekanisme seperti itu adalah karena pengguna Milvus biasanya tidak memiliki permintaan yang tinggi untuk konsistensi data, dan mereka dapat menerima kompromi dalam visibilitas data untuk kinerja sistem yang lebih baik.</p>
<p>Selain itu, Milvus juga mengadopsi beberapa layanan mikro dan memisahkan penyimpanan dari komputasi. Dalam <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">arsitektur Milvus</a>, S3, MinIo, dan Azure Blob digunakan untuk penyimpanan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Milvus</span> </span></p>
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
    </button></h2><p>Saat ini, semakin banyak database cloud-native yang menjadikan replikasi log sebagai layanan tersendiri. Dengan demikian, biaya penambahan replika read-only dan replikasi heterogen dapat dikurangi. Menggunakan beberapa layanan mikro memungkinkan pemanfaatan cepat infrastruktur berbasis cloud yang sudah matang, yang tidak mungkin dilakukan oleh database tradisional. Layanan log individual dapat mengandalkan replikasi berbasis konsensus, tetapi juga dapat mengikuti strategi boneka Rusia untuk mengadopsi berbagai protokol konsistensi bersama dengan Paxos atau Raft untuk mencapai linearitas.</p>
<h2 id="References" class="common-anchor-header">Referensi<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos menjadi sederhana[J]. ACM SIGACT News (Kolom Komputasi Terdistribusi) 32, 4 (Nomor Keseluruhan 121, Desember 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. Mencari algoritma konsensus yang dapat dimengerti[C] / Konferensi Teknis Tahunan USENIX 2014 (Usenix ATC 14). 2014: 305-319.</li>
<li>Oki B M, Liskov B H. Replikasi berstempel: Metode salinan utama baru untuk mendukung sistem terdistribusi yang sangat tersedia[C]//Prosiding Simposium ACM tahunan ketujuh tentang Prinsip-prinsip komputasi terdistribusi. 1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, dkk. PacificA: Replikasi dalam sistem penyimpanan terdistribusi berbasis log[J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D, dkk. Amazon aurora: Tentang menghindari konsensus terdistribusi untuk i/os, komit, dan perubahan keanggotaan[C] / Prosiding Konferensi Internasional Manajemen Data 2018. 2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, dkk. Socrates: Server sql baru di cloud [C] / Prosiding Konferensi Internasional Manajemen Data 2019. 2019: 1743-1756.</li>
</ul>
