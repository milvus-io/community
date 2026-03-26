---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  Ketersediaan Tinggi Basis Data Vektor: Cara Membangun Cluster Siaga Milvus
  dengan CDC
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Pelajari cara membangun basis data vektor dengan ketersediaan tinggi dengan
  Milvus CDC. Panduan langkah demi langkah untuk replikasi siaga primer,
  failover, dan DR produksi.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>Setiap basis data produksi membutuhkan rencana ketika terjadi masalah. Basis data relasional telah memiliki pengiriman WAL, replikasi binlog, dan kegagalan otomatis selama beberapa dekade. Tetapi <a href="https://zilliz.com/learn/what-is-a-vector-database">database vektor</a> - meskipun menjadi infrastruktur inti untuk aplikasi AI - masih mengejar ketertinggalan dalam hal ini. Sebagian besar hanya menawarkan redundansi tingkat node. Jika sebuah cluster penuh gagal, Anda harus memulihkan dari cadangan dan membangun kembali <a href="https://zilliz.com/learn/vector-index">indeks vektor</a> dari awal - sebuah proses yang dapat memakan waktu berjam-jam dan biaya ribuan dolar dalam komputasi, karena membuat ulang <a href="https://zilliz.com/glossary/vector-embeddings">embedding</a> melalui pipeline ML Anda tidaklah murah.</p>
<p><a href="https://milvus.io/">Milvus</a> mengambil pendekatan yang berbeda. Milvus menawarkan ketersediaan tinggi berlapis: replika tingkat node untuk failover cepat dalam sebuah cluster, replikasi berbasis CDC untuk perlindungan tingkat cluster dan lintas wilayah, dan cadangan untuk pemulihan jaring pengaman. Model berlapis ini merupakan praktik standar dalam database tradisional - Milvus adalah database vektor utama pertama yang membawanya ke beban kerja vektor.</p>
<p>Panduan ini mencakup dua hal: strategi ketersediaan tinggi yang tersedia untuk basis data vektor (sehingga Anda dapat mengevaluasi apa arti "siap produksi" yang sebenarnya), dan tutorial praktis untuk menyiapkan replikasi siaga utama Milvus CDC dari awal.</p>
<blockquote>
<p>Ini adalah <strong>Bagian 1</strong> dari sebuah seri:</p>
<ul>
<li><strong>Bagian 1</strong> (artikel ini): Menyiapkan replikasi primary-standby pada cluster baru</li>
<li><strong>Bagian 2</strong>: Menambahkan CDC ke cluster yang sudah ada yang sudah memiliki data, menggunakan <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a></li>
<li><strong>Bagian 3</strong>: Mengelola failover - mempromosikan siaga ketika primary down</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">Mengapa Ketersediaan Tinggi Lebih Penting untuk Basis Data Vektor?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika database SQL tradisional gagal, Anda kehilangan akses ke catatan terstruktur - tetapi data itu sendiri biasanya dapat diimpor kembali dari sumber hulu. Ketika database vektor gagal, pemulihan pada dasarnya lebih sulit.</p>
<p>Basis data vektor menyimpan <a href="https://zilliz.com/glossary/vector-embeddings">penyematan</a> - representasi numerik padat yang dihasilkan oleh model ML. Membangunnya kembali berarti menjalankan kembali seluruh dataset Anda melalui pipeline penyematan: memuat dokumen mentah, memotong-motongnya, memanggil <a href="https://zilliz.com/ai-models">model penyematan</a>, dan mengindeks ulang semuanya. Untuk dataset dengan ratusan juta vektor, hal ini dapat memakan waktu berhari-hari dan menghabiskan biaya ribuan dolar untuk komputasi GPU.</p>
<p>Sementara itu, sistem yang bergantung pada <a href="https://zilliz.com/learn/what-is-vector-search">pencarian vektor</a> sering kali berada di jalur kritis:</p>
<ul>
<li><strong>Jalur pipa<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a></strong> yang memberi daya pada chatbot dan pencarian yang berhadapan langsung dengan pelanggan - jika basis data vektor mati, pencarian akan berhenti dan AI akan mengembalikan jawaban yang umum atau halusinasi.</li>
<li><strong>Mesin rekomendasi</strong> yang menyajikan saran produk atau konten secara real time - waktu henti berarti kehilangan pendapatan.</li>
<li><strong>Deteksi penipuan dan</strong> sistem<strong>pemantauan anomali</strong> yang mengandalkan <a href="https://zilliz.com/glossary/similarity-search">pencarian kemiripan</a> untuk menandai aktivitas yang mencurigakan - kesenjangan dalam cakupan menciptakan jendela kerentanan.</li>
<li><strong>Sistem agen otonom</strong> yang menggunakan penyimpanan vektor untuk memori dan pengambilan alat - agen gagal atau mengulang tanpa basis pengetahuan mereka.</li>
</ul>
<p>Jika Anda mengevaluasi basis data vektor untuk salah satu dari kasus penggunaan ini, ketersediaan tinggi bukanlah fitur yang bagus untuk diperiksa nanti. Ini harus menjadi salah satu hal pertama yang Anda lihat.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">Seperti Apa HA Tingkat Produksi untuk Database Vektor?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Tidak semua ketersediaan tinggi itu sama. Database vektor yang hanya menangani kegagalan node dalam satu cluster tidak "sangat tersedia" seperti yang dibutuhkan sistem produksi. HA yang sebenarnya perlu mencakup tiga lapisan:</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Apa yang Dilindungi</th><th>Bagaimana Cara Kerjanya</th><th>Waktu Pemulihan</th><th>Kehilangan Data</th></tr>
</thead>
<tbody>
<tr><td><strong>Tingkat simpul</strong> (multi-replika)</td><td>Kerusakan node tunggal, kegagalan perangkat keras, OOM kill, kegagalan AZ</td><td>Menyalin <a href="https://milvus.io/docs/glossary.md">segmen data</a> yang sama di beberapa node; node lain menyerap beban</td><td>Instan</td><td>Nol</td></tr>
<tr><td><strong>Tingkat cluster</strong> (replikasi CDC)</td><td>Seluruh cluster mati - peluncuran K8 yang buruk, penghapusan ruang nama, kerusakan penyimpanan</td><td>Mengalirkan setiap penulisan ke cluster siaga melalui <a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log</a>; siaga selalu beberapa detik di belakang</td><td>Menit</td><td>Detik</td></tr>
<tr><td><strong>Jaring pengaman</strong> (pencadangan berkala)</td><td>Kerusakan data yang dahsyat, ransomware, kesalahan manusia yang menyebar melalui replikasi</td><td>Mengambil snapshot secara berkala dan menyimpannya di lokasi terpisah</td><td>Jam</td><td>Jam (sejak pencadangan terakhir)</td></tr>
</tbody>
</table>
<p>Lapisan-lapisan ini saling melengkapi, bukan alternatif. Penerapan produksi harus menumpuknya:</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">Multi-replika</a> pertama</strong> - menangani kegagalan yang paling umum (kerusakan node, kegagalan AZ) dengan waktu henti nol dan kehilangan data nol.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a> berikutnya</strong> - melindungi dari kegagalan yang tidak dapat ditangani oleh multi-replika: pemadaman di seluruh cluster, kesalahan manusia yang dahsyat. Cluster siaga berada di domain kegagalan yang berbeda.</li>
<li>Pencadangan<strong><a href="https://milvus.io/docs/milvus_backup_overview.md">berkala</a> selalu</strong> - jaring pengaman Anda sebagai pilihan terakhir. Bahkan CDC tidak dapat menyelamatkan Anda jika data yang rusak direplikasi ke siaga sebelum Anda menangkapnya.</li>
</ol>
<p>Ketika mengevaluasi database vektor, tanyakan: manakah dari ketiga lapisan ini yang benar-benar didukung oleh produk? Kebanyakan database vektor saat ini hanya menawarkan yang pertama. Milvus mendukung ketiganya, dengan CDC sebagai fitur bawaan - bukan pengaya pihak ketiga.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Apa itu Milvus CDC dan Bagaimana Cara Kerjanya?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC (Change Data Capture)</strong> adalah fitur replikasi bawaan yang membaca <a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log (WAL)</a> dari cluster utama dan mengalirkan setiap entri ke cluster siaga yang terpisah. Siaga mengulang entri dan berakhir dengan data yang sama, biasanya beberapa detik di belakang.</p>
<p>Pola ini sudah mapan di dunia database. MySQL memiliki replikasi binlog. PostgreSQL memiliki pengiriman WAL. MongoDB memiliki replikasi berbasis oplog. Ini adalah teknik-teknik yang sudah terbukti yang telah membuat database relasional dan dokumen berjalan dalam produksi selama beberapa dekade. Milvus membawa pendekatan yang sama untuk beban kerja vektor - Milvus adalah <a href="https://zilliz.com/learn/what-is-a-vector-database">database vektor</a> utama pertama yang menawarkan replikasi berbasis WAL sebagai fitur bawaan.</p>
<p>Tiga properti membuat CDC cocok untuk pemulihan bencana:</p>
<ul>
<li><strong>Sinkronisasi latensi rendah.</strong> CDC mengalirkan operasi saat terjadi, bukan dalam kelompok yang dijadwalkan. Siaga tetap berada beberapa detik di belakang yang utama dalam kondisi normal.</li>
<li><strong>Pemutaran ulang yang dipesan.</strong> Operasi tiba di siaga dalam urutan yang sama dengan urutan yang ditulis. Data tetap konsisten tanpa rekonsiliasi.</li>
<li><strong>Pemulihan pos pemeriksaan.</strong> Jika proses CDC macet atau jaringan terputus, proses akan dilanjutkan dari titik terakhir. Tidak ada data yang dilewati atau diduplikasi.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">Bagaimana Cara Kerja Arsitektur CDC?</h3><p>Penerapan CDC memiliki tiga komponen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>Arsitektur CDC yang menunjukkan Source Cluster dengan Streaming Node dan CDC Node yang mengonsumsi WAL, mereplikasi data ke lapisan Proxy Target Cluster, yang meneruskan operasi DDL/DCL/DML ke Streaming Node dan menambahkan ke WAL</span> </span></p>
<table>
<thead>
<tr><th>Komponen</th><th>Peran</th></tr>
</thead>
<tbody>
<tr><td><strong>Cluster utama</strong></td><td><a href="https://milvus.io/docs/architecture_overview.md">Instance Milvus</a> produksi. Semua pembacaan dan penulisan dilakukan di sini. Setiap penulisan dicatat dalam WAL.</td></tr>
<tr><td><strong>Simpul CDC</strong></td><td>Sebuah proses latar belakang di samping primary. Membaca entri WAL dan meneruskannya ke siaga. Berjalan secara independen dari jalur baca/tulis - tidak berdampak pada kinerja kueri atau sisipan.</td></tr>
<tr><td><strong>Klaster siaga</strong></td><td>Instance Milvus terpisah yang mengulang entri WAL yang diteruskan. Menyimpan data yang sama dengan data utama, beberapa detik di belakang. Dapat melayani kueri baca tetapi tidak menerima penulisan.</td></tr>
</tbody>
</table>
<p>Alurnya: penulisan mengenai primary → CDC Node menyalinnya ke standby → standby mengulangnya. Tidak ada hal lain yang berbicara ke jalur penulisan siaga. Jika primary turun, siaga sudah memiliki hampir semua data dan dapat dipromosikan.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">Tutorial: Menyiapkan Milvus CDC Standby Cluster Siaga<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Sisa artikel ini adalah panduan langsung. Pada akhirnya, Anda akan memiliki dua cluster Milvus yang berjalan dengan replikasi waktu nyata di antara keduanya.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><p>Sebelum memulai:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 atau yang lebih baru.</strong> CDC membutuhkan versi ini. Direkomendasikan patch 2.6.x terbaru.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> v1.3.4 atau yang lebih baru.</strong> Panduan ini menggunakan Operator untuk manajemen klaster pada Kubernetes.</li>
<li><strong>Sebuah klaster Kubernetes yang sedang berjalan</strong> dengan konfigurasi <code translate="no">kubectl</code> dan <code translate="no">helm</code>.</li>
<li><strong>Python dengan <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> untuk langkah konfigurasi replikasi.</li>
</ul>
<p>Dua batasan dalam rilis saat ini:</p>
<table>
<thead>
<tr><th>Batasan</th><th>Detail</th></tr>
</thead>
<tbody>
<tr><td>Replika CDC tunggal</td><td>Satu replika CDC per cluster. CDC terdistribusi direncanakan untuk rilis mendatang.</td></tr>
<tr><td>Tidak ada BulkInsert</td><td><a href="https://milvus.io/docs/import-data.md">BulkInsert</a> tidak didukung saat CDC diaktifkan. Juga direncanakan untuk rilis mendatang.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">Langkah 1: Tingkatkan Operator Milvus</h3><p>Tingkatkan Operator Milvus ke v1.3.4 atau yang lebih baru:</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pastikan pod operator sudah berjalan:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">Langkah 2: Menyebarkan Cluster Utama</h3><p>Buat berkas YAML untuk cluster primer (sumber). Bagian <code translate="no">cdc</code> di bawah <code translate="no">components</code> memberi tahu Operator untuk menggunakan Node CDC di samping cluster:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Pengaturan <code translate="no">msgStreamType: woodpecker</code> menggunakan <a href="https://milvus.io/docs/four_layers.md">WAL Woodpecker</a> bawaan Milvus, bukan antrean pesan eksternal seperti Kafka atau Pulsar. Woodpecker adalah log tulis-dahulu cloud-native yang diperkenalkan pada Milvus 2.6 yang menghilangkan kebutuhan akan infrastruktur pesan eksternal.</p>
<p>Terapkan konfigurasi:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Tunggu hingga semua pod mencapai status Running. Konfirmasikan bahwa pod CDC sudah aktif:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">Langkah 3: Menyebarkan Klaster Siaga</h3><p>Cluster siaga (target) menggunakan versi Milvus yang sama namun tidak menyertakan komponen CDC - cluster ini hanya menerima data yang direplikasi:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Terapkan:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verifikasi semua pod sudah berjalan:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">Langkah 4: Konfigurasikan Hubungan Replikasi</h3><p>Dengan kedua cluster berjalan, konfigurasikan topologi replikasi menggunakan Python dengan <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>Tentukan detail koneksi cluster dan nama saluran fisik (pchannel):</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Bangun konfigurasi replikasi:</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>Terapkan ke kedua cluster:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Setelah ini berhasil, perubahan bertahap pada primary mulai mereplikasi ke standby secara otomatis.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">Langkah 5: Verifikasi bahwa replikasi telah berfungsi</h3><ol>
<li>Sambungkan ke primary dan <a href="https://milvus.io/docs/manage-collections.md">buat koleksi</a>, <a href="https://milvus.io/docs/insert-update-delete.md">masukkan beberapa vektor</a>, dan <a href="https://milvus.io/docs/load-and-release.md">muat</a></li>
<li>Jalankan pencarian di primary untuk mengonfirmasi data yang ada di sana</li>
<li>Hubungkan ke siaga dan jalankan pencarian yang sama</li>
<li>Jika siaga mengembalikan hasil yang sama, replikasi berfungsi</li>
</ol>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a> mencakup pembuatan koleksi, penyisipan, dan pencarian jika Anda memerlukan referensi.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">Menjalankan CDC dalam Produksi<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Menyiapkan CDC adalah bagian yang paling mudah. Menjaganya agar tetap andal dari waktu ke waktu membutuhkan perhatian pada beberapa area operasional.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">Memantau Jeda Replikasi</h3><p>Siaga selalu sedikit di belakang yang utama - yang melekat pada replikasi asinkron. Di bawah beban normal, jeda ini hanya beberapa detik. Tetapi lonjakan penulisan, kemacetan jaringan, atau tekanan sumber daya pada siaga dapat menyebabkannya bertambah.</p>
<p>Lacak kelambatan sebagai metrik dan waspadai. Jeda yang bertambah tanpa pemulihan biasanya berarti CDC Node tidak dapat mengimbangi throughput penulisan. Periksa bandwidth jaringan di antara cluster terlebih dahulu, lalu pertimbangkan apakah siaga membutuhkan lebih banyak sumber daya.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">Gunakan Siaga untuk Penskalaan Baca</h3><p>Siaga bukan hanya cadangan dingin yang tidak digunakan sampai terjadi bencana. Cadangan ini menerima <a href="https://milvus.io/docs/single-vector-search.md">permintaan pencarian dan kueri</a> saat replikasi aktif - hanya penulisan yang diblokir. Hal ini membuka penggunaan praktis:</p>
<ul>
<li>Rute <a href="https://zilliz.com/glossary/similarity-search">pencarian kesamaan</a> batch atau beban kerja analitik ke siaga</li>
<li>Membagi lalu lintas baca selama jam sibuk untuk mengurangi tekanan pada server utama</li>
<li>Menjalankan kueri yang mahal (top-K besar, pencarian yang difilter di seluruh koleksi besar) tanpa memengaruhi latensi penulisan produksi</li>
</ul>
<p>Hal ini mengubah infrastruktur DR Anda menjadi aset kinerja. Siaga akan tetap bekerja meskipun tidak ada yang rusak.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">Mengukur Siaga dengan Benar</h3><p>Siaga mengulang setiap penulisan dari primary, sehingga membutuhkan sumber daya komputasi dan memori yang sama. Jika Anda juga merutekan pembacaan ke sana, perhitungkan beban tambahan tersebut. Persyaratan penyimpanannya sama - menyimpan data yang sama.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">Uji Failover Sebelum Anda Membutuhkannya</h3><p>Jangan menunggu sampai terjadi pemadaman total untuk mengetahui bahwa proses failover Anda tidak berfungsi. Jalankan uji coba secara berkala:</p>
<ol>
<li>Hentikan penulisan ke primary</li>
<li>Tunggu sampai siaga menyusul (lag → 0)</li>
<li>Promosikan siaga</li>
<li>Verifikasi kueri mengembalikan hasil yang diharapkan</li>
<li>Membalikkan proses</li>
</ol>
<p>Ukur berapa lama waktu yang dibutuhkan setiap langkah dan dokumentasikan. Tujuannya adalah untuk membuat failover menjadi prosedur rutin dengan waktu yang diketahui - bukan improvisasi yang menegangkan pada pukul 3 pagi. Bagian 3 dari seri ini akan membahas proses failover secara mendetail.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">Tidak Ingin Mengelola CDC Sendiri? Zilliz Cloud Menanganinya<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>Menyiapkan dan mengoperasikan replikasi CDC dari Milvus memang sangat kuat, tetapi ada biaya operasional yang harus dikeluarkan: Anda mengelola dua cluster, memantau kesehatan replikasi, menangani runbook failover, dan memelihara infrastruktur di seluruh wilayah. Untuk tim yang menginginkan HA tingkat produksi tanpa beban operasional, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (mengelola Milvus) menyediakannya.</p>
<p><strong>Global Cluster</strong> adalah fitur utama Zilliz Cloud. Fitur ini memungkinkan Anda menjalankan penerapan Milvus di berbagai wilayah - Amerika Utara, Eropa, Asia Pasifik, dan banyak lagi - sebagai satu cluster logis. Di baliknya, ia menggunakan teknologi replikasi CDC/WAL yang sama dengan yang dijelaskan dalam artikel ini, tetapi dikelola sepenuhnya:</p>
<table>
<thead>
<tr><th>Kemampuan</th><th>CDC yang Dikelola Sendiri (artikel ini)</th><th>Zilliz Cloud Global Cluster</th></tr>
</thead>
<tbody>
<tr><td><strong>Replikasi</strong></td><td>Anda mengonfigurasi dan memantau</td><td>Pipeline CDC otomatis dan asinkron</td></tr>
<tr><td><strong>Failover</strong></td><td>Buku panduan manual</td><td>Otomatis - tidak ada perubahan kode, tidak ada pembaruan string koneksi</td></tr>
<tr><td><strong>Penyembuhan mandiri</strong></td><td>Anda menyediakan kembali cluster yang gagal</td><td>Otomatis: mendeteksi kondisi basi, mengatur ulang, dan membangun ulang sebagai sekunder baru</td></tr>
<tr><td><strong>Lintas wilayah</strong></td><td>Anda menerapkan dan mengelola kedua cluster</td><td>Multi-wilayah bawaan dengan akses baca lokal</td></tr>
<tr><td><strong>RPO</strong></td><td>Detik (tergantung pada pemantauan Anda)</td><td>Detik (tidak direncanakan) / Nol (peralihan terencana)</td></tr>
<tr><td><strong>RTO</strong></td><td>Menit (tergantung pada buku harian Anda)</td><td>Menit (otomatis)</td></tr>
</tbody>
</table>
<p>Selain Global Cluster, paket Business Critical juga mencakup fitur-fitur DR tambahan:</p>
<ul>
<li><strong>Point-in-Time Recovery (PITR</strong> ) - memutar kembali koleksi ke waktu kapan pun dalam jendela retensi, berguna untuk memulihkan dari penghapusan yang tidak disengaja atau kerusakan data yang direplikasi ke siaga.</li>
<li>Pencadangan<strong>lintas wilayah</strong> - replikasi pencadangan otomatis yang sedang berlangsung ke wilayah tujuan. Pemulihan ke cluster baru membutuhkan waktu beberapa menit.</li>
<li><strong>SLA waktu aktif 99,99%</strong> - didukung oleh penerapan multi-AZ dengan banyak replika.</li>
</ul>
<p>Jika Anda menjalankan pencarian vektor dalam produksi dan DR merupakan persyaratan, ada baiknya mengevaluasi Zilliz Cloud bersama dengan pendekatan Milvus yang dikelola sendiri. <a href="https://zilliz.com/contact-sales">Hubungi tim Zilliz</a> untuk informasi lebih lanjut.</p>
<h2 id="Whats-Next" class="common-anchor-header">Apa Selanjutnya<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Artikel ini membahas lanskap HA untuk basis data vektor dan membahas cara membangun pasangan siaga-primer dari awal. Berikutnya:</p>
<ul>
<li><strong>Bagian 2</strong>: Menambahkan CDC ke cluster Milvus yang sudah ada yang sudah memiliki data, menggunakan <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> untuk menyemai siaga sebelum mengaktifkan replikasi</li>
<li><strong>Bagian 3</strong>: Mengelola failover - mempromosikan siaga, mengalihkan lalu lintas, dan memulihkan primer asli</li>
</ul>
<p>Tetap disini.</p>
<hr>
<p>Jika Anda menjalankan <a href="https://milvus.io/">Milvus</a> dalam produksi dan berpikir tentang pemulihan bencana, kami ingin membantu:</p>
<ul>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk mengajukan pertanyaan, membagikan arsitektur HA Anda, dan belajar dari tim lain yang menjalankan Milvus dalam skala besar.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kantor Milvus gratis selama 20 menit</a> untuk membahas pengaturan DR Anda - baik itu konfigurasi CDC, perencanaan failover, atau penerapan multi-wilayah.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur dan langsung beralih ke HA yang siap produksi, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus yang dikelola) menawarkan ketersediaan tinggi lintas wilayah melalui fitur Global Cluster - tidak perlu penyiapan CDC manual.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang muncul ketika tim mulai menyiapkan ketersediaan tinggi database vektor:</p>
<p><strong>T: Apakah CDC memperlambat cluster utama?</strong></p>
<p>Tidak. Node CDC membaca log WAL secara asinkron, tidak tergantung pada jalur baca/tulis. Node ini tidak bersaing dengan kueri atau sisipan untuk sumber daya di cluster primer. Anda tidak akan melihat perbedaan kinerja dengan CDC yang diaktifkan.</p>
<p><strong>T: Dapatkah CDC mereplikasi data yang sudah ada sebelum diaktifkan?</strong></p>
<p>Tidak - CDC hanya menangkap perubahan dari titik saat CDC diaktifkan. Untuk membawa data yang sudah ada ke dalam siaga, gunakan <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> untuk menyemai siaga terlebih dahulu, kemudian aktifkan CDC untuk replikasi yang sedang berlangsung. Bagian 2 dari seri ini mencakup alur kerja ini.</p>
<p><strong>T: Apakah saya masih memerlukan CDC jika saya sudah mengaktifkan multi-replika?</strong></p>
<p>Keduanya melindungi dari berbagai mode kegagalan. <a href="https://milvus.io/docs/replica.md">Multi-replika</a> menyimpan salinan <a href="https://milvus.io/docs/glossary.md">segmen</a> yang sama di seluruh node dalam satu klaster - sangat bagus untuk kegagalan node, tidak berguna saat seluruh klaster hilang (penyebaran yang buruk, pemadaman AZ, penghapusan ruang nama). CDC menyimpan cluster terpisah dalam domain kegagalan yang berbeda dengan data hampir seketika. Untuk apa pun di luar lingkungan pengembangan, Anda membutuhkan keduanya.</p>
<p><strong>T: Bagaimana Milvus CDC dibandingkan dengan replikasi di database vektor lainnya?</strong></p>
<p>Sebagian besar database vektor saat ini menawarkan redundansi tingkat node (setara dengan multi-replika) tetapi tidak memiliki replikasi tingkat cluster. Milvus saat ini merupakan satu-satunya database vektor utama dengan replikasi CDC berbasis WAL - pola yang telah terbukti sama dengan database relasional seperti PostgreSQL dan MySQL yang telah digunakan selama beberapa dekade. Jika failover lintas klaster atau lintas wilayah merupakan persyaratan, ini adalah pembeda yang berarti untuk dievaluasi.</p>
