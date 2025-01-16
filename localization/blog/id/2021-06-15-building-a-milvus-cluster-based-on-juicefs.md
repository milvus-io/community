---
id: building-a-milvus-cluster-based-on-juicefs.md
title: Apa itu JuiceFS?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Pelajari cara membangun cluster Milvus berdasarkan JuiceFS, sistem file
  bersama yang dirancang untuk lingkungan cloud-native.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Membangun Cluster Milvus Berdasarkan JuiceFS</custom-h1><p>Kolaborasi antara komunitas sumber terbuka adalah hal yang ajaib. Para sukarelawan yang bersemangat, cerdas, dan kreatif tidak hanya membuat solusi sumber terbuka tetap inovatif, mereka juga bekerja untuk menyatukan berbagai alat yang berbeda dengan cara yang menarik dan bermanfaat. <a href="https://milvus.io/">Milvus</a>, basis data vektor paling populer di dunia, dan <a href="https://github.com/juicedata/juicefs">JuiceFS</a>, sistem berkas bersama yang dirancang untuk lingkungan cloud-native, disatukan dalam semangat ini oleh komunitas sumber terbuka masing-masing. Artikel ini menjelaskan apa itu JuiceFS, cara membangun cluster Milvus berdasarkan penyimpanan file bersama JuiceFS, dan kinerja yang dapat diharapkan pengguna dengan menggunakan solusi ini.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>Apa itu JuiceFS?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS adalah sistem berkas POSIX terdistribusi sumber terbuka berkinerja tinggi, yang dapat dibangun di atas Redis dan S3. Sistem ini dirancang untuk lingkungan cloud-native dan mendukung pengelolaan, analisis, pengarsipan, dan pencadangan data jenis apa pun. JuiceFS biasanya digunakan untuk memecahkan tantangan data besar, membangun aplikasi kecerdasan buatan (AI), dan pengumpulan log. Sistem ini juga mendukung pembagian data di beberapa klien dan dapat digunakan secara langsung sebagai penyimpanan bersama di Milvus.</p>
<p>Setelah data, dan metadata yang sesuai, disimpan ke penyimpanan objek dan <a href="https://redis.io/">Redis</a>, JuiceFS berfungsi sebagai middleware tanpa kewarganegaraan. Berbagi data direalisasikan dengan memungkinkan berbagai aplikasi yang berbeda untuk saling terhubung satu sama lain secara mulus melalui antarmuka sistem berkas standar. JuiceFS mengandalkan Redis, sebuah penyimpanan data dalam memori sumber terbuka, untuk penyimpanan metadata. Redis digunakan karena menjamin atomisitas dan menyediakan operasi metadata berkinerja tinggi. Semua data disimpan dalam penyimpanan objek melalui klien JuiceFS. Diagram arsitekturnya adalah sebagai berikut:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Membangun kluster Milvus berdasarkan JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus cluster yang dibangun dengan JuiceFS (lihat diagram arsitektur di bawah ini) bekerja dengan memecah permintaan hulu menggunakan Mishards, sebuah middleware cluster sharding, untuk mengalirkan permintaan ke sub-modul. Ketika memasukkan data, Mishards mengalokasikan permintaan hulu ke simpul tulis Milvus, yang menyimpan data yang baru dimasukkan dalam JuiceFS. Saat membaca data, Mishards memuat data dari JuiceFS melalui simpul baca Milvus ke memori untuk diproses, kemudian mengumpulkan dan mengembalikan hasil dari sub-layanan di hulu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-dibangun-dengan-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Langkah 1: Meluncurkan layanan MySQL</strong></h3><p>Luncurkan layanan MySQL di <strong>setiap</strong> node dalam cluster. Untuk detailnya, lihat <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Mengelola Metadata dengan MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Langkah 2: Membuat sistem berkas JuiceFS</strong></h3><p>Untuk tujuan demonstrasi, digunakan program JuiceFS biner yang sudah dikompilasi. Unduh <a href="https://github.com/juicedata/juicefs/releases">paket instalasi</a> yang tepat untuk sistem Anda dan ikuti <a href="https://github.com/juicedata/juicefs-quickstart">Panduan Memulai Cepat</a> JuiceFS untuk petunjuk instalasi yang mendetail. Untuk membuat sistem berkas JuiceFS, pertama-tama siapkan basis data Redis untuk penyimpanan metadata. Direkomendasikan untuk penerapan awan publik, Anda meng-host layanan Redis pada awan yang sama dengan aplikasi. Selain itu, siapkan penyimpanan objek untuk JuiceFS. Dalam contoh ini, Azure Blob Storage digunakan; namun, JuiceFS mendukung hampir semua layanan objek. Pilih layanan penyimpanan objek yang paling sesuai dengan kebutuhan skenario Anda.</p>
<p>Setelah mengonfigurasi layanan Redis dan penyimpanan objek, format sistem berkas baru dan pasang JuiceFS ke direktori lokal:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Jika server Redis tidak berjalan secara lokal, ganti hos lokal dengan alamat berikut ini: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>Ketika instalasi berhasil, JuiceFS mengembalikan halaman penyimpanan bersama <strong>/root/jfs</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>instalasi-sukses.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Langkah 3: Mulai Milvus</strong></h3><p>Semua node dalam klaster harus sudah terinstal Milvus, dan setiap node Milvus harus dikonfigurasi dengan izin baca atau tulis. Hanya satu node Milvus yang dapat dikonfigurasi sebagai node tulis, dan sisanya harus menjadi node baca. Pertama, atur parameter bagian <code translate="no">cluster</code> dan <code translate="no">general</code> dalam berkas konfigurasi sistem Milvus <strong>server_config.yaml</strong>:</p>
<p><strong>Bagian</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Parameter</strong></th><th style="text-align:left"><strong>Deskripsi</strong></th><th style="text-align:left"><strong>Konfigurasi</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Apakah akan mengaktifkan mode cluster</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Peran penyebaran Milvus</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Bagian</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Selama instalasi, jalur penyimpanan bersama JuiceFS yang dikonfigurasi ditetapkan sebagai <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>Setelah instalasi selesai, mulai Milvus dan konfirmasikan bahwa Milvus telah diluncurkan dengan benar. Terakhir, mulai layanan Mishards pada <strong>salah</strong> satu node dalam kluster. Gambar di bawah ini menunjukkan peluncuran Mishards yang berhasil. Untuk informasi lebih lanjut, lihat <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">tutorial</a> GitHub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Tolok ukur kinerja</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Solusi penyimpanan bersama biasanya diimplementasikan oleh sistem penyimpanan yang terhubung ke jaringan (NAS). Jenis sistem NAS yang umum digunakan termasuk Network File System (NFS) dan Server Message Block (SMB). Platform cloud publik umumnya menyediakan layanan penyimpanan terkelola yang kompatibel dengan protokol-protokol ini, seperti Amazon Elastic File System (EFS).</p>
<p>Tidak seperti sistem NAS tradisional, JuiceFS diimplementasikan berdasarkan Filesystem in Userspace (FUSE), di mana semua pembacaan dan penulisan data dilakukan secara langsung di sisi aplikasi, sehingga mengurangi latensi akses. Terdapat juga fitur unik pada JuiceFS yang tidak dapat ditemukan pada sistem NAS lainnya, seperti kompresi data dan caching.</p>
<p>Pengujian benchmark menunjukkan bahwa JuiceFS menawarkan keunggulan utama dibandingkan EFS. Pada benchmark metadata (Gambar 1), JuiceFS menunjukkan operasi I/O per detik (IOPS) hingga sepuluh kali lebih tinggi daripada EFS. Selain itu, tolok ukur throughput I/O (Gambar 2) menunjukkan JuiceFS mengungguli EFS baik dalam skenario pekerjaan tunggal maupun banyak pekerjaan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-2.png</span> </span></p>
<p>Selain itu, pengujian benchmark menunjukkan waktu pengambilan kueri pertama, atau waktu untuk memuat data yang baru dimasukkan dari disk ke memori, untuk kluster Milvus berbasis JuiceFS rata-rata hanya 0,032 detik, yang mengindikasikan bahwa data dimuat dari disk ke memori hampir seketika. Untuk pengujian ini, waktu pengambilan kueri pertama diukur dengan menggunakan satu juta baris data vektor 128 dimensi yang disisipkan dalam kelompok 100 ribu dengan interval 1 hingga 8 detik.</p>
<p>JuiceFS adalah sistem penyimpanan file bersama yang stabil dan dapat diandalkan, dan cluster Milvus yang dibangun di atas JuiceFS menawarkan kinerja tinggi dan kapasitas penyimpanan yang fleksibel.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Pelajari lebih lanjut tentang Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah alat canggih yang mampu mendukung beragam kecerdasan buatan dan aplikasi pencarian kemiripan vektor. Untuk mempelajari lebih lanjut tentang proyek ini, lihat sumber daya berikut:</p>
<ul>
<li>Baca <a href="https://zilliz.com/blog">blog</a> kami.</li>
<li>Berinteraksi dengan komunitas sumber terbuka kami di <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Gunakan atau kontribusikan database vektor paling populer di dunia di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Menguji dan menerapkan aplikasi AI dengan cepat dengan <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> baru kami.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>penulis bio-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>penulis bio-jingjing jia.png</span> </span></p>
