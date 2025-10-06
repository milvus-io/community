---
id: how-to-debug-slow-requests-in-milvus.md
title: Cara Men-debug Permintaan Pencarian Lambat di Milvus
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  Dalam artikel ini, kami akan membagikan cara melakukan triase permintaan
  lambat di Milvus dan membagikan langkah-langkah praktis yang bisa Anda lakukan
  untuk menjaga latensi tetap dapat diprediksi, stabil, dan rendah secara
  konsisten.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>Kinerja adalah inti dari Milvus. Dalam kondisi normal, permintaan pencarian dalam Milvus selesai hanya dalam hitungan milidetik. Namun, apa yang terjadi jika cluster Anda melambat-ketika latensi pencarian menjadi beberapa detik penuh?</p>
<p>Pencarian yang lambat tidak sering terjadi, tetapi bisa muncul dalam skala besar atau dalam beban kerja yang kompleks. Dan ketika terjadi, hal ini menjadi penting: mengganggu pengalaman pengguna, menurunkan performa aplikasi, dan sering kali mengungkap inefisiensi tersembunyi dalam pengaturan Anda.</p>
<p>Dalam artikel ini, kami akan membahas cara melakukan triase permintaan lambat di Milvus dan membagikan langkah-langkah praktis yang dapat Anda lakukan untuk menjaga latensi agar tetap dapat diprediksi, stabil, dan rendah secara konsisten.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Mengidentifikasi Penelusuran yang Lambat<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Mendiagnosis permintaan yang lambat dimulai dengan dua pertanyaan: <strong>seberapa sering hal itu terjadi, dan ke mana arah waktunya?</strong> Milvus memberi Anda kedua jawaban tersebut melalui metrik dan log.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Metrik Milvus</h3><p>Milvus mengekspor metrik terperinci yang dapat Anda pantau di dasbor Grafana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Panel-panel utama meliputi:</p>
<ul>
<li><p><strong>Kualitas Layanan → Kueri Lambat</strong>: Menandai permintaan apa pun yang melebihi proxy.slowQuerySpanInSeconds (default: 5 detik). Ini juga ditandai di Prometheus.</p></li>
<li><p><strong>Kualitas Layanan → Latensi Pencarian</strong>: Menunjukkan distribusi latensi secara keseluruhan. Jika ini terlihat normal, tetapi pengguna akhir masih mengalami penundaan, masalahnya kemungkinan besar berada di luar Milvus - di lapisan jaringan atau aplikasi.</p></li>
<li><p><strong>Query Node → Cari Latensi berdasarkan Fase</strong>: Memecah latensi menjadi antrian, kueri, dan mengurangi tahapan. Untuk atribusi yang lebih dalam, panel seperti <em>Scalar</em> <em>Filter Latency</em>, <em>Vector Search Latency</em>, dan <em>Wait tSafe Latency</em> mengungkapkan tahap mana yang mendominasi.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Catatan Milvus</h3><p>Milvus juga mencatat setiap permintaan yang berlangsung lebih dari satu detik, ditandai dengan penanda seperti [Pencarian lambat]. Log ini menunjukkan kueri <em>mana</em> yang lambat, melengkapi wawasan <em>di mana</em> dari metrik. Sebagai patokan:</p>
<ul>
<li><p><strong>&lt;30 ms</strong> → latensi penelusuran yang sehat di sebagian besar skenario</p></li>
<li><p><strong>&gt; 100 ms</strong> → layak untuk diselidiki</p></li>
<li><p><strong>&gt; 1 detik</strong> → pasti lambat dan membutuhkan perhatian</p></li>
</ul>
<p>Contoh log:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>Singkatnya, <strong>metrik memberi tahu Anda ke mana arah waktu berjalan; log memberi tahu Anda kueri mana yang terkena</strong>.</p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Menganalisis Akar Penyebab<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Beban Kerja yang Berat</h3><p>Penyebab umum dari permintaan yang lambat adalah beban kerja yang berlebihan. Ketika sebuah permintaan memiliki <strong>NQ</strong> (jumlah kueri per permintaan) yang sangat besar, permintaan tersebut dapat berjalan dalam waktu yang lama dan memonopoli sumber daya node kueri. Permintaan lain akan menumpuk di belakangnya, yang mengakibatkan meningkatnya latensi antrean. Bahkan jika setiap permintaan memiliki NQ yang kecil, throughput (QPS) keseluruhan yang sangat tinggi masih dapat menyebabkan efek yang sama, karena Milvus dapat menggabungkan permintaan pencarian yang bersamaan secara internal.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinyal yang harus diperhatikan:</strong></p>
<ul>
<li><p>Semua kueri menunjukkan latensi yang sangat tinggi.</p></li>
<li><p>Metrik Query Node melaporkan <strong>latensi antrean</strong> yang tinggi.</p></li>
<li><p>Log menunjukkan permintaan dengan NQ besar dan durasi total yang panjang, tetapi durasiPerNQ yang relatif kecil-menunjukkan bahwa satu permintaan yang sangat besar mendominasi sumber daya.</p></li>
</ul>
<p><strong>Cara memperbaikinya:</strong></p>
<ul>
<li><p><strong>Kueri batch</strong>: Jaga agar NQ tetap sederhana untuk menghindari kelebihan beban pada satu permintaan.</p></li>
<li><p><strong>Kurangi node kueri</strong>: Jika konkurensi tinggi merupakan bagian reguler dari beban kerja Anda, tambahkan node kueri untuk menyebarkan beban dan mempertahankan latensi yang rendah.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Pemfilteran yang Tidak Efisien</h3><p>Hambatan umum lainnya berasal dari filter yang tidak efisien. Jika ekspresi filter dilakukan dengan buruk atau field tidak memiliki indeks skalar, Milvus mungkin akan kembali ke pemindaian <strong>penuh</strong> alih-alih memindai subset kecil yang ditargetkan. Filter JSON dan pengaturan konsistensi yang ketat dapat meningkatkan overhead.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinyal yang harus diperhatikan:</strong></p>
<ul>
<li><p><strong>Latensi Filter Skalar</strong> Tinggi dalam metrik Query Node.</p></li>
<li><p>Lonjakan latensi yang nyata hanya ketika filter diterapkan.</p></li>
<li><p><strong>Latensi tSafe Wait yang</strong> lama jika konsistensi yang ketat diaktifkan.</p></li>
</ul>
<p><strong>Cara memperbaikinya:</strong></p>
<ul>
<li><strong>Menyederhanakan ekspresi filter</strong>: Kurangi kompleksitas rencana kueri dengan mengoptimalkan filter. Sebagai contoh, ganti rantai OR yang panjang dengan ekspresi IN:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus juga memperkenalkan mekanisme templating ekspresi filter yang dirancang untuk meningkatkan efisiensi dengan mengurangi waktu yang dihabiskan untuk mengurai ekspresi yang kompleks. Lihat <a href="https://milvus.io/docs/filtering-templating.md">dokumen ini</a> untuk lebih jelasnya.</p></li>
<li><p><strong>Tambahkan indeks yang tepat</strong>: Hindari pemindaian penuh dengan membuat indeks skalar pada bidang yang digunakan dalam filter.</p></li>
<li><p><strong>Menangani JSON secara efisien</strong>: Milvus 2.6 memperkenalkan indeks jalur dan indeks datar untuk bidang JSON, yang memungkinkan penanganan data JSON secara efisien. Penghancuran JSON juga ada di <a href="https://milvus.io/docs/roadmap.md">peta jalan</a> untuk lebih meningkatkan kinerja. Lihat <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">dokumen bidang JSON</a> untuk informasi tambahan.</p></li>
<li><p><strong>Menyesuaikan tingkat konsistensi</strong>: Gunakan pembacaan yang konsisten <em>Bounded</em> atau <em>Eventually</em> ketika jaminan yang ketat tidak diperlukan, sehingga mengurangi waktu tunggu <em>tSafe</em>.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Pilihan Indeks Vektor yang Tidak Tepat</h3><p><a href="https://milvus.io/docs/index-explained.md">Indeks vektor</a> tidak cocok untuk semua. Memilih indeks yang salah dapat berdampak signifikan pada latensi. Indeks dalam memori memberikan kinerja tercepat tetapi menghabiskan lebih banyak memori, sedangkan indeks pada disk menghemat memori dengan mengorbankan kecepatan. Vektor biner juga memerlukan strategi pengindeksan khusus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinyal yang harus diperhatikan:</strong></p>
<ul>
<li><p>Latensi Pencarian Vektor yang tinggi dalam metrik Query Node.</p></li>
<li><p>Kejenuhan I/O disk saat menggunakan DiskANN atau MMAP.</p></li>
<li><p>Kueri yang lebih lambat segera setelah restart karena cache mulai dingin.</p></li>
</ul>
<p><strong>Cara memperbaikinya:</strong></p>
<ul>
<li><p><strong>Sesuaikan indeks dengan beban kerja (vektor mengambang):</strong></p>
<ul>
<li><p><strong>HNSW</strong> - terbaik untuk kasus penggunaan dalam memori dengan pemanggilan yang tinggi dan latensi yang rendah.</p></li>
<li><p><strong>Keluarga IVF</strong> - pertukaran yang fleksibel antara pemanggilan dan kecepatan.</p></li>
<li><p><strong>DiskANN</strong> - mendukung dataset berskala miliaran, tetapi membutuhkan bandwidth disk yang besar.</p></li>
</ul></li>
<li><p><strong>Untuk vektor biner:</strong> Gunakan <a href="https://milvus.io/docs/minhash-lsh.md">indeks MINHASH_LSH</a> (diperkenalkan pada Milvus 2.6) dengan metrik MHJACCARD untuk memperkirakan kemiripan Jaccard secara efisien.</p></li>
<li><p><strong>Aktifkan</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: Memetakan berkas indeks ke dalam memori alih-alih menyimpannya secara penuh untuk menyeimbangkan antara latensi dan penggunaan memori.</p></li>
<li><p>Menyetel<strong>parameter indeks/pencarian</strong>: Menyesuaikan pengaturan untuk menyeimbangkan pemanggilan kembali dan latensi untuk beban kerja Anda.</p></li>
<li><p><strong>Mengurangi pengaktifan yang dingin</strong>: Lakukan pemanasan segmen yang sering diakses setelah restart untuk menghindari kelambatan kueri awal.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Kondisi Waktu Proses &amp; Lingkungan</h3><p>Tidak semua kueri lambat disebabkan oleh kueri itu sendiri. Node kueri sering berbagi sumber daya dengan pekerjaan latar belakang, seperti pemadatan, migrasi data, atau pembuatan indeks. Peningkatan yang sering terjadi dapat menghasilkan banyak segmen kecil yang tidak terindeks, sehingga memaksa kueri untuk memindai data mentah. Dalam beberapa kasus, ketidakefisienan versi tertentu juga dapat menyebabkan latensi hingga ditambal.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinyal yang harus diperhatikan:</strong></p>
<ul>
<li><p>Lonjakan penggunaan CPU selama pekerjaan latar belakang (pemadatan, migrasi, pembuatan indeks).</p></li>
<li><p>Kejenuhan I/O disk yang mempengaruhi kinerja kueri.</p></li>
<li><p>Pemanasan cache yang sangat lambat setelah restart.</p></li>
<li><p>Sejumlah besar segmen kecil yang tidak diindeks (dari peningkatan yang sering terjadi).</p></li>
<li><p>Regresi latensi yang terkait dengan versi Milvus tertentu.</p></li>
</ul>
<p><strong>Cara memperbaikinya:</strong></p>
<ul>
<li><p><strong>Jadwalkan ulang tugas-tugas latar belakang</strong> (misalnya, pemadatan) ke jam-jam di luar jam sibuk.</p></li>
<li><p><strong>Lepaskan koleksi yang tidak terpakai</strong> untuk mengosongkan memori.</p></li>
<li><p><strong>Memperhitungkan waktu pemanasan</strong> setelah restart; cache pra-pemanasan jika diperlukan.</p></li>
<li><p><strong>Batch upserts</strong> untuk mengurangi pembuatan segmen kecil dan membiarkan pemadatan tetap berjalan.</p></li>
<li><p><strong>Tetap mutakhir</strong>: tingkatkan ke versi Milvus yang lebih baru untuk perbaikan bug dan pengoptimalan.</p></li>
<li><p><strong>Sumber daya penyediaan</strong>: mendedikasikan CPU/memori ekstra untuk beban kerja yang sensitif terhadap latensi.</p></li>
</ul>
<p>Dengan mencocokkan setiap sinyal dengan tindakan yang tepat, sebagian besar kueri yang lambat dapat diselesaikan dengan cepat dan dapat diprediksi.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Praktik Terbaik untuk Mencegah Pencarian Lambat<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Sesi debugging terbaik adalah sesi yang tidak perlu Anda jalankan. Berdasarkan pengalaman kami, beberapa kebiasaan sederhana sangat membantu mencegah pencarian yang lambat di Milvus:</p>
<ul>
<li><p><strong>Rencanakan alokasi sumber daya</strong> untuk menghindari perebutan CPU dan disk.</p></li>
<li><p><strong>Mengatur peringatan proaktif</strong> untuk kegagalan dan lonjakan latensi.</p></li>
<li><p><strong>Jaga agar ekspresi filter tetap</strong> pendek, sederhana, dan efisien.</p></li>
<li><p><strong>Batch upserts</strong> dan menjaga NQ/QPS pada tingkat yang berkelanjutan.</p></li>
<li><p><strong>Mengindeks semua bidang</strong> yang digunakan dalam filter.</p></li>
</ul>
<p>Kueri lambat di Milvus jarang terjadi, dan ketika muncul, biasanya penyebabnya jelas dan dapat didiagnosis. Dengan metrik, log, dan pendekatan terstruktur, Anda dapat dengan cepat mengidentifikasi dan menyelesaikan masalah. Ini adalah panduan yang sama yang digunakan oleh tim dukungan kami setiap hari - dan sekarang menjadi milik Anda juga.</p>
<p>Kami berharap panduan ini tidak hanya memberikan kerangka kerja pemecahan masalah tetapi juga kepercayaan diri untuk menjaga beban kerja Milvus Anda berjalan dengan lancar dan efisien.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 Ingin mempelajari lebih dalam?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a> untuk mengajukan pertanyaan, berbagi pengalaman, dan belajar dari komunitas.</p></li>
<li><p>Daftar ke <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Jam Kerja Milvus</strong></a> kami untuk berbicara langsung dengan tim kami dan mendapatkan bantuan langsung dengan beban kerja Anda.</p></li>
</ul>
