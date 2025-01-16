---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Penyisipan Data dan Persistensi Data dalam Basis Data Vektor
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Pelajari tentang mekanisme di balik penyisipan data dan persistensi data dalam
  basis data vektor Milvus.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/sunby">Bingyi Sun</a> dan diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Pada artikel sebelumnya dalam seri Deep Dive, kami telah memperkenalkan <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">bagaimana data diproses di Milvus</a>, database vektor paling canggih di dunia. Dalam artikel ini, kita akan terus memeriksa komponen-komponen yang terlibat dalam penyisipan data, mengilustrasikan model data secara detail, dan menjelaskan bagaimana persistensi data dicapai di Milvus.</p>
<p>Langsung ke:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Rekap arsitektur Milvus</a></li>
<li><a href="#The-portal-of-data-insertion-requests">Portal permintaan penyisipan data</a></li>
<li><a href="#Data-coord-and-data-node">Koordinat data dan simpul data</a></li>
<li><a href="#Root-coord-and-Time-Tick">Koordinat akar dan Time Tick</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Organisasi data: koleksi, partisi, pecahan (saluran), segmen</a></li>
<li><a href="#Data-allocation-when-and-how">Alokasi data: kapan dan bagaimana</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Struktur berkas binlog dan persistensi data</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Rekap arsitektur Milvus<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Arsitektur Milvus</span>. </span></p>
<p>SDK mengirimkan permintaan data ke proxy, portal, melalui load balancer. Kemudian proxy berinteraksi dengan layanan koordinator untuk menulis permintaan DDL (bahasa definisi data) dan DML (bahasa manipulasi data) ke dalam penyimpanan pesan.</p>
<p>Node pekerja, termasuk node kueri, node data, dan node indeks, mengkonsumsi permintaan dari penyimpanan pesan. Lebih khusus lagi, simpul kueri bertanggung jawab atas kueri data; simpul data bertanggung jawab atas penyisipan data dan persistensi data; dan simpul indeks terutama berurusan dengan pembuatan indeks dan akselerasi kueri.</p>
<p>Lapisan paling bawah adalah penyimpanan objek, yang terutama memanfaatkan MinIO, S3, dan AzureBlob untuk menyimpan log, delta binlog, dan file indeks.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">Portal permintaan penyisipan data<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Proxy di Milvus</span>. </span></p>
<p>Proxy berfungsi sebagai portal permintaan penyisipan data.</p>
<ol>
<li>Awalnya, proxy menerima permintaan penyisipan data dari SDK, dan mengalokasikan permintaan tersebut ke dalam beberapa bucket dengan menggunakan algoritma hash.</li>
<li>Kemudian proxy meminta data coord untuk menetapkan segmen, unit terkecil dalam Milvus untuk penyimpanan data.</li>
<li>Setelah itu, proxy memasukkan informasi dari segmen yang diminta ke dalam penyimpanan pesan agar informasi tersebut tidak hilang.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Koordinat data dan simpul data<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Fungsi utama dari data coord adalah untuk mengatur alokasi channel dan segmen, sedangkan fungsi utama dari data node adalah untuk mengkonsumsi dan menyimpan data yang telah disisipkan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Data coord dan data node dalam Milvus</span>. </span></p>
<h3 id="Function" class="common-anchor-header">Fungsi</h3><p>Data coord berfungsi dalam beberapa aspek berikut:</p>
<ul>
<li><p>Mengalokasikan<strong>ruang segmen</strong>Data coord mengalokasikan ruang dalam segmen yang sedang tumbuh ke proxy sehingga proxy dapat menggunakan ruang kosong dalam segmen untuk menyisipkan data.</p></li>
<li><p>Mencatat<strong>alokasi segmen dan waktu berakhirnya ruang yang dialokasikan dalam segmen</strong>Ruang dalam setiap segmen yang dialokasikan oleh data coord tidak permanen, oleh karena itu, data coord juga perlu mencatat waktu berakhirnya setiap alokasi segmen.</p></li>
<li><p><strong>Secara otomatis menghapus data segmen</strong>Jika segmen penuh, data coord secara otomatis memicu penghapusan data.</p></li>
<li><p><strong>Mengalokasikan saluran ke node data</strong>Sebuah koleksi dapat memiliki beberapa <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">vchannel</a>. Data coord menentukan vchannel mana yang dikonsumsi oleh node data yang mana.</p></li>
</ul>
<p>Simpul data berfungsi dalam aspek-aspek berikut:</p>
<ul>
<li><p><strong>Mengkonsumsi data</strong>Node data mengkonsumsi data dari saluran yang dialokasikan oleh data coord dan membuat urutan untuk data.</p></li>
<li><p><strong>Persistensi data</strong>Cache data yang dimasukkan ke dalam memori dan secara otomatis mem-flush data yang dimasukkan tersebut ke disk ketika volume data mencapai ambang batas tertentu.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Alur kerja</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>Satu vchannel hanya dapat ditetapkan ke satu simpul data</span> </span>.</p>
<p>Seperti yang ditunjukkan pada gambar di atas, koleksi memiliki empat vchannel (V1, V2, V3, dan V4) dan ada dua node data. Sangat mungkin bahwa data coord akan menetapkan satu node data untuk mengonsumsi data dari V1 dan V2, dan node data lainnya dari V3 dan V4. Satu vchannel tunggal tidak dapat ditetapkan ke beberapa node data dan ini untuk mencegah pengulangan konsumsi data, yang jika tidak akan menyebabkan kumpulan data yang sama dimasukkan ke dalam segmen yang sama secara berulang-ulang.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Koordinat akar dan Detak Waktu<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root coord mengelola TSO (timestamp Oracle), dan menerbitkan pesan time tick secara global. Setiap permintaan penyisipan data memiliki stempel waktu yang ditetapkan oleh root coord. Time Tick adalah landasan Milvus yang bertindak seperti jam di Milvus dan menandakan pada titik waktu mana sistem Milvus berada.</p>
<p>Ketika data ditulis dalam Milvus, setiap permintaan penyisipan data membawa cap waktu. Selama konsumsi data, setiap kali node data mengkonsumsi data yang cap waktunya berada dalam rentang tertentu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>Contoh penyisipan data dan konsumsi data berdasarkan cap waktu</span> </span>.</p>
<p>Gambar di atas adalah proses penyisipan data. Nilai dari timestamp diwakili oleh angka 1,2,6,5,7,8. Data dituliskan ke dalam sistem oleh dua proksi: p1 dan p2. Selama konsumsi data, jika waktu saat ini dari Time Tick adalah 5, node data hanya dapat membaca data 1 dan 2. Kemudian selama pembacaan kedua, jika waktu saat ini dari Time Tick menjadi 9, data 6,7,8 dapat dibaca oleh node data.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Organisasi data: koleksi, partisi, pecahan (saluran), segmen<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Organisasi data di Milvus</span>. </span></p>
<p>Baca <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">artikel</a> ini terlebih dahulu untuk memahami model data di Milvus dan konsep koleksi, pecahan, partisi, dan segmen.</p>
<p>Secara ringkas, unit data terbesar di Milvus adalah collection yang dapat diibaratkan sebagai sebuah tabel di dalam database relasional. Sebuah koleksi dapat memiliki beberapa pecahan (masing-masing sesuai dengan saluran) dan beberapa partisi di dalam setiap pecahan. Seperti yang ditunjukkan pada ilustrasi di atas, saluran (pecahan) adalah batang vertikal sedangkan partisi adalah batang horizontal. Pada setiap persimpangan terdapat konsep segmen, unit terkecil untuk alokasi data. Dalam Milvus, indeks dibangun di atas segmen. Selama kueri, sistem Milvus juga menyeimbangkan beban kueri di node kueri yang berbeda dan proses ini dilakukan berdasarkan unit segmen. Segmen berisi beberapa <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlog</a>, dan ketika data segmen dikonsumsi, file binlog akan dihasilkan.</p>
<h3 id="Segment" class="common-anchor-header">Segmen</h3><p>Ada tiga jenis segmen dengan status yang berbeda di Milvus: segmen tumbuh, tertutup, dan memerah.</p>
<h4 id="Growing-segment" class="common-anchor-header">Segmen yang sedang tumbuh</h4><p>Segmen yang sedang tumbuh adalah segmen yang baru dibuat yang dapat dialokasikan ke proksi untuk penyisipan data. Ruang internal segmen dapat digunakan, dialokasikan, atau bebas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>Tiga status dalam segmen yang sedang tumbuh</span> </span></p>
<ul>
<li>Digunakan: bagian ruang dari segmen yang sedang tumbuh ini telah dikonsumsi oleh simpul data.</li>
<li>Dialokasikan: bagian ruang dari segmen yang sedang tumbuh ini telah diminta oleh proxy dan dialokasikan oleh data coord. Ruang yang dialokasikan akan berakhir setelah periode waktu tertentu.</li>
<li>Free: bagian ruang dari segmen yang sedang tumbuh ini belum digunakan. Nilai ruang bebas sama dengan keseluruhan ruang segmen dikurangi dengan nilai ruang yang digunakan dan dialokasikan. Jadi ruang kosong suatu segmen bertambah seiring dengan habisnya ruang yang dialokasikan.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Segmen tertutup</h4><p>Segmen tertutup adalah segmen tertutup yang tidak dapat lagi dialokasikan ke proxy untuk penyisipan data.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmen tertutup di Milvus</span> </span></p>
<p>Segmen yang sedang tumbuh disegel dalam keadaan berikut:</p>
<ul>
<li>Jika ruang yang digunakan dalam segmen yang sedang tumbuh mencapai 75% dari total ruang, segmen tersebut akan disegel.</li>
<li>Flush() dipanggil secara manual oleh pengguna Milvus untuk mempertahankan semua data dalam sebuah koleksi.</li>
<li>Segmen-segmen yang tumbuh yang tidak disegel setelah jangka waktu yang lama akan disegel karena terlalu banyak segmen yang tumbuh menyebabkan simpul-simpul data menggunakan memori secara berlebihan.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Segmen yang memerah</h4><p>Segmen yang disiram adalah segmen yang telah ditulis ke dalam disk. Flush mengacu pada penyimpanan data segmen ke penyimpanan objek demi persistensi data. Segmen hanya dapat di-flush ketika ruang yang dialokasikan dalam segmen yang disegel habis masa berlakunya. Ketika di-flush, segmen yang disegel berubah menjadi segmen yang disiram.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmen yang dibilas di Milvus</span> </span></p>
<h3 id="Channel" class="common-anchor-header">Saluran</h3><p>Sebuah saluran dialokasikan:</p>
<ul>
<li>Ketika simpul data dimulai atau dimatikan; atau</li>
<li>Ketika ruang segmen yang dialokasikan diminta oleh proxy.</li>
</ul>
<p>Kemudian ada beberapa strategi alokasi saluran. Milvus mendukung 2 dari strategi tersebut:</p>
<ol>
<li>Hash yang konsisten</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Hashing konsistensi di Milvus</span> </span></p>
<p>Strategi default di Milvus. Strategi ini memanfaatkan teknik hashing untuk memberikan posisi pada setiap saluran pada ring, kemudian mencari searah jarum jam untuk menemukan simpul data terdekat dengan saluran. Dengan demikian, dalam ilustrasi di atas, saluran 1 dialokasikan ke simpul data 2, sedangkan saluran 2 dialokasikan ke simpul data 3.</p>
<p>Namun, salah satu masalah dengan strategi ini adalah bahwa peningkatan atau penurunan jumlah node data (mis. Node data baru dimulai atau node data tiba-tiba mati) dapat mempengaruhi proses alokasi saluran. Untuk mengatasi masalah ini, data coord memonitor status dari data node melalui etcd sehingga data coord dapat segera diberitahu jika terjadi perubahan status dari data node. Kemudian data coord selanjutnya menentukan ke node data mana yang akan mengalokasikan saluran dengan benar.</p>
<ol start="2">
<li>Penyeimbangan beban</li>
</ol>
<p>Strategi kedua adalah mengalokasikan saluran dari koleksi yang sama ke node data yang berbeda, memastikan saluran dialokasikan secara merata. Tujuan dari strategi ini adalah untuk mencapai keseimbangan beban.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Alokasi data: kapan dan bagaimana<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Proses alokasi data di Milvus</span> </span></p>
<p>Proses alokasi data dimulai dari klien. Pertama-tama klien mengirimkan permintaan penyisipan data dengan stempel waktu <code translate="no">t1</code> ke proxy. Kemudian proxy mengirimkan permintaan ke data coord untuk alokasi segmen.</p>
<p>Setelah menerima permintaan alokasi segmen, data coord memeriksa status segmen dan mengalokasikan segmen. Jika ruang saat ini dari segmen yang dibuat cukup untuk baris data yang baru dimasukkan, data coord mengalokasikan segmen yang dibuat tersebut. Namun, jika ruang yang tersedia di segmen saat ini tidak mencukupi, data coord akan mengalokasikan segmen baru. Data coord dapat mengembalikan satu atau beberapa segmen pada setiap permintaan. Sementara itu, data coord juga menyimpan segmen yang dialokasikan di meta server untuk persistensi data.</p>
<p>Selanjutnya, data coord mengembalikan informasi segmen yang dialokasikan (termasuk ID segmen, jumlah baris, waktu kedaluwarsa <code translate="no">t2</code>, dll.) ke proxy. Proxy mengirimkan informasi segmen yang dialokasikan tersebut ke penyimpanan pesan sehingga informasi ini dicatat dengan benar. Perhatikan bahwa nilai <code translate="no">t1</code> harus lebih kecil dari pada <code translate="no">t2</code>. Nilai default dari <code translate="no">t2</code> adalah 2.000 milidetik dan dapat diubah dengan mengkonfigurasi parameter <code translate="no">segment.assignmentExpiration</code> dalam file <code translate="no">data_coord.yaml</code>.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Struktur file binlog dan persistensi data<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>Penyiraman simpul data</span> </span></p>
<p>Simpul data berlangganan ke penyimpan pesan karena permintaan penyisipan data disimpan di penyimpan pesan dan simpul data dengan demikian dapat mengkonsumsi pesan penyisipan. Simpul data pertama-tama menempatkan permintaan penyisipan dalam buffer penyisipan, dan ketika permintaan terakumulasi, permintaan tersebut akan dibuang ke penyimpanan objek setelah mencapai ambang batas.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Struktur file binlog</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Struktur file binlog</span>. </span></p>
<p>Struktur file binlog di Milvus mirip dengan yang ada di MySQL. Binlog digunakan untuk melayani dua fungsi: pemulihan data dan pembangunan indeks.</p>
<p>Sebuah binlog berisi banyak <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">peristiwa</a>. Setiap kejadian memiliki tajuk kejadian dan data kejadian.</p>
<p>Metadata termasuk waktu pembuatan binlog, ID simpul tulis, panjang event, dan NextPosition (offset dari event berikutnya), dan lain-lain ditulis dalam header event.</p>
<p>Data peristiwa dapat dibagi menjadi dua bagian: tetap dan variabel.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>Struktur file dari sebuah event penyisipan</span> </span>.</p>
<p>Bagian tetap dalam data event dari sebuah <code translate="no">INSERT_EVENT</code> berisi <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code>, dan <code translate="no">reserved</code>.</p>
<p>Bagian variabel sebenarnya menyimpan data yang disisipkan. Data yang disisipkan diurutkan ke dalam format parket dan disimpan dalam file ini.</p>
<h3 id="Data-persistence" class="common-anchor-header">Persistensi data</h3><p>Jika ada beberapa kolom dalam skema, Milvus akan menyimpan binlog dalam kolom-kolom.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Persistensi data binlog</span>. </span></p>
<p>Seperti yang diilustrasikan pada gambar di atas, kolom pertama adalah primary key binlog. Kolom kedua adalah kolom timestamp. Sisanya adalah kolom-kolom yang didefinisikan dalam skema. Jalur file binlog di MinIO juga ditunjukkan pada gambar di atas.</p>
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
