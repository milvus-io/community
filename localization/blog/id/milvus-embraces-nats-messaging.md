---
id: milvus-embraces-nats-messaging.md
title: 'Mengoptimalkan Komunikasi Data: Milvus Merangkul Pesan NATS'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Memperkenalkan integrasi NATS dan Milvus, mengeksplorasi fitur-fiturnya,
  proses pengaturan dan migrasi, dan hasil pengujian kinerja.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam permadani pemrosesan data yang rumit, komunikasi tanpa batas adalah benang merah yang mengikat operasi bersama. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, <a href="https://zilliz.com/cloud">basis data vektor sumber terbuka</a> yang menjadi pelopor, telah memulai perjalanan transformatif dengan fitur terbarunya: Integrasi pesan NATS. Dalam artikel blog yang komprehensif ini, kami akan mengungkap seluk-beluk integrasi ini, mengeksplorasi fitur-fitur intinya, proses penyiapan, manfaat migrasi, dan bagaimana integrasi ini dibandingkan dengan pendahulunya, RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Memahami peran antrean pesan di Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam arsitektur cloud-native Milvus, antrean pesan, atau Log Broker, memiliki peran yang sangat penting. Ini adalah tulang punggung yang memastikan aliran data yang persisten, sinkronisasi, pemberitahuan peristiwa, dan integritas data selama pemulihan sistem. Secara tradisional, RocksMQ adalah pilihan yang paling mudah dalam mode Milvus Standalone, terutama jika dibandingkan dengan Pulsar dan Kafka, tetapi keterbatasannya menjadi jelas dengan data yang luas dan skenario yang kompleks.</p>
<p>Milvus 2.3 memperkenalkan NATS, sebuah implementasi MQ single-node, yang mendefinisikan ulang cara mengelola aliran data. Tidak seperti pendahulunya, NATS membebaskan pengguna Milvus dari kendala kinerja, memberikan pengalaman yang mulus dalam menangani volume data yang besar.</p>
<h2 id="What-is-NATS" class="common-anchor-header">Apa itu NATS?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS adalah teknologi konektivitas sistem terdistribusi yang diimplementasikan di Go. NATS mendukung berbagai mode komunikasi seperti Request-Reply dan Publish-Subscribe di seluruh sistem, menyediakan persistensi data melalui JetStream, dan menawarkan kemampuan terdistribusi melalui RAFT bawaan. Anda dapat merujuk ke <a href="https://nats.io/">situs web resmi NATS</a> untuk pemahaman yang lebih rinci tentang NATS.</p>
<p>Dalam mode Milvus 2.3 Standalone, NATS, JetStream, dan PubSub menyediakan kemampuan MQ yang kuat bagi Milvus.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Mengaktifkan NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 menawarkan opsi kontrol baru, <code translate="no">mq.type</code>, yang memungkinkan pengguna untuk menentukan jenis MQ yang ingin mereka gunakan. Untuk mengaktifkan NATS, setel <code translate="no">mq.type=natsmq</code>. Jika Anda melihat log yang mirip dengan log di bawah ini setelah Anda memulai instans Milvus, Anda telah berhasil mengaktifkan NATS sebagai antrean pesan.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Mengonfigurasi NATS untuk Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Opsi kustomisasi NATS termasuk menentukan port pendengaran, direktori penyimpanan JetStream, ukuran muatan maksimum, dan batas waktu inisialisasi. Menyempurnakan pengaturan ini akan memastikan kinerja dan keandalan yang optimal.</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Catatan:</strong></p>
<ul>
<li><p>Anda harus menentukan <code translate="no">server.port</code> untuk mendengarkan server NATS. Jika terjadi konflik port, Milvus tidak dapat memulai. Atur <code translate="no">server.port=-1</code> untuk memilih port secara acak.</p></li>
<li><p><code translate="no">storeDir</code> menentukan direktori untuk penyimpanan JetStream. Kami menyarankan untuk menyimpan direktori di solid-state drive (SSD) berkinerja tinggi untuk hasil baca/tulis yang lebih baik dari Milvus.</p></li>
<li><p><code translate="no">maxFileStore</code> menetapkan batas atas ukuran penyimpanan JetStream. Melebihi batas ini akan mencegah penulisan data lebih lanjut.</p></li>
<li><p><code translate="no">maxPayload</code> membatasi ukuran pesan individual. Anda harus menjaganya tetap di atas 5MB untuk menghindari penolakan penulisan.</p></li>
<li><p><code translate="no">initializeTimeout</code>mengontrol batas waktu pengaktifan server NATS.</p></li>
<li><p><code translate="no">monitor</code> mengonfigurasi log independen NATS.</p></li>
<li><p><code translate="no">retention</code> mengontrol mekanisme penyimpanan pesan NATS.</p></li>
</ul>
<p>Untuk informasi lebih lanjut, lihat <a href="https://docs.nats.io/running-a-nats-service/configuration">dokumentasi resmi NATS</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Migrasi dari RocksMQ ke NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Migrasi dari RocksMQ ke NATS merupakan proses yang mulus yang melibatkan langkah-langkah seperti menghentikan operasi penulisan, pembilasan data, memodifikasi konfigurasi, dan memverifikasi migrasi melalui log Milvus.</p>
<ol>
<li><p>Sebelum memulai migrasi, hentikan semua operasi tulis di Milvus.</p></li>
<li><p>Jalankan operasi <code translate="no">FlushALL</code> pada Milvus dan tunggu hingga selesai. Langkah ini memastikan bahwa semua data yang tertunda telah di-flush dan sistem siap untuk dimatikan.</p></li>
<li><p>Ubahlah file konfigurasi Milvus dengan mengatur <code translate="no">mq.type=natsmq</code> dan sesuaikan opsi-opsi yang relevan pada bagian <code translate="no">natsmq</code>.</p></li>
<li><p>Jalankan Milvus 2.3.</p></li>
<li><p>Cadangkan dan bersihkan data asli yang tersimpan dalam direktori <code translate="no">rocksmq.path</code>. (Opsional)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs RocksMQ: Adu Performa<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Pengujian Performa Pub/Sub</h3><ul>
<li><p><strong>Platform Pengujian:</strong> Chip / Memori M1 Pro: 16GB</p></li>
<li><p><strong>Skenario Pengujian:</strong> Mengirimkan dan menerbitkan paket data acak ke sebuah topik secara berulang-ulang sampai hasil terakhir yang diterbitkan diterima.</p></li>
<li><p><strong>Hasil:</strong></p>
<ul>
<li><p>Untuk paket data yang lebih kecil (&lt; 64kb), RocksMQ mengungguli NATS dalam hal memori, CPU, dan kecepatan respons.</p></li>
<li><p>Untuk paket data yang lebih besar (&gt; 64kb), NATS mengungguli RocksMQ, menawarkan waktu respons yang jauh lebih cepat.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Jenis Pengujian</th><th>MQ</th><th>jumlah operasi</th><th>biaya per operasi</th><th>Biaya memori</th><th>Total Waktu CPU</th><th>Biaya penyimpanan</th></tr>
</thead>
<tbody>
<tr><td>5MB * 100 Pub / Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4,29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB * 100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1,18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB * 500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 s/op</td><td>2,60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB * 500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614.9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3,29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331.2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635.1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB * 50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232.3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Tabel 1: Hasil pengujian kinerja Pub/Sub</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Pengujian Integrasi Milvus</h3><p><strong>Ukuran data:</strong> 100M</p>
<p><strong>Hasil:</strong> Dalam pengujian ekstensif dengan set data 100 juta vektor, NATS menampilkan pencarian vektor dan latensi kueri yang lebih rendah.</p>
<table>
<thead>
<tr><th>Metrik</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>Latensi pencarian vektor rata-rata</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Permintaan pencarian vektor per detik (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Latensi kueri rata-rata</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Permintaan kueri per detik (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Tabel 2: Hasil pengujian integrasi Milvus dengan dataset 100 juta</p>
<p><strong>Dataset: &lt;100M</strong></p>
<p><strong>Hasil</strong> Untuk dataset yang lebih kecil dari 100 juta, NATS dan RocksMQ menunjukkan performa yang serupa.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Kesimpulan: Memberdayakan Milvus dengan pesan NATS<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>Integrasi NATS dalam Milvus menandai langkah yang signifikan dalam pemrosesan data. Baik untuk mempelajari analitik waktu nyata, aplikasi pembelajaran mesin, atau usaha intensif data apa pun, NATS memberdayakan proyek Anda dengan efisiensi, keandalan, dan kecepatan. Seiring perkembangan lanskap data, memiliki sistem perpesanan yang kuat seperti NATS dalam Milvus memastikan komunikasi data yang lancar, andal, dan berkinerja tinggi.</p>
