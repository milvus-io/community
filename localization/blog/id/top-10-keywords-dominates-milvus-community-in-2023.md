---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: >-
  Mengungkap 10 Kata Kunci Teratas yang Mendominasi Komunitas Milvus di Tahun
  2023
author: 'Jack Li, Fendy Feng'
date: 2024-1-21
desc: >-
  Postingan ini mengeksplorasi inti dari komunitas dengan menganalisis riwayat
  obrolan dan mengungkapkan 10 kata kunci teratas dalam diskusi.
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: >-
  assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md'
---
<p>Di penghujung tahun 2023, mari kita tinjau kembali perjalanan komunitas Milvus yang luar biasa: membanggakan <a href="https://github.com/milvus-io/milvus">25.000 GitHub Stars</a>, peluncuran <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3.0</a>, dan melampaui 10 juta unduhan <a href="https://hub.docker.com/r/milvusdb/milvus">citra Docker</a>. Tulisan ini menjelajahi inti dari komunitas dengan menganalisis riwayat obrolan dan mengungkapkan 10 kata kunci teratas dalam diskusi.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/o5uMdNLioQ0?list=PLPg7_faNDlT5Fb8WN8r1PzzQTNzdechnS" title="Mastering Milvus: Turbocharge Your Vector Database with Optimization Secrets!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="common-anchor-header">Versi #1 - Munculnya AIGC mendorong iterasi Milvus yang cepat<button data-href="#1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="anchor-icon" translate="no">
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
    </button></h2><p>Secara mengejutkan, "Versi" muncul sebagai kata kunci yang paling banyak dibicarakan pada tahun 2023. Pengungkapan ini berakar pada gelombang AI tahun ini, dengan basis data vektor sebagai infrastruktur penting untuk mengatasi tantangan dalam masalah halusinasi aplikasi AIGC.</p>
<p>Antusiasme di sekitar basis data vektor mendorong Milvus ke tahap iterasi yang cepat. Komunitas menyaksikan rilis Dua Puluh versi pada tahun 2023 saja, mengakomodasi permintaan pengembang AIGC yang membanjiri komunitas dengan pertanyaan tentang memilih versi Milvus yang optimal untuk berbagai aplikasi. Bagi pengguna yang sedang menavigasi pembaruan ini, kami sarankan untuk menggunakan versi terbaru untuk mendapatkan fitur dan kinerja yang lebih baik.</p>
<p>Jika Anda tertarik dengan perencanaan rilis Milvus, lihat halaman <a href="https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule">Roadmap Milvus</a> di situs web resminya.</p>
<h2 id="2-Search--beyond-Vector-Search" class="common-anchor-header">Penelusuran # 2 - di luar Penelusuran Vektor<button data-href="#2-Search--beyond-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>"Pencarian" menempati posisi kedua, yang mencerminkan peran fundamentalnya dalam operasi basis data. Milvus mendukung berbagai kemampuan pencarian, mulai dari pencarian Top-K ANN hingga pencarian yang difilter secara skalar dan pencarian rentang. Rilis Milvus 3.0 (Beta) yang akan segera hadir menjanjikan pencarian kata kunci (embedding jarang), yang ditunggu-tunggu oleh banyak pengembang aplikasi RAG.</p>
<p>Diskusi komunitas tentang pencarian berfokus pada kinerja, kemampuan, dan prinsip. Pengguna sering mengajukan pertanyaan tentang pemfilteran atribut, pengaturan nilai ambang batas indeks, dan mengatasi masalah latensi. Sumber daya seperti <a href="https://milvus.io/docs/v2.0.x/search.md">dokumentasi kueri dan pencarian</a>, <a href="https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103">Proposal Peningkatan Milvus (MEP)</a>, dan diskusi Discord telah menjadi referensi utama untuk mengungkap seluk-beluk pencarian di Milvus.</p>
<h2 id="3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="common-anchor-header">Memori #3 - pertukaran antara kinerja dan akurasi untuk meminimalkan overhead memori<button data-href="#3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="anchor-icon" translate="no">
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
    </button></h2><p>"Memori" juga menjadi pusat perhatian dalam diskusi komunitas selama setahun terakhir. Sebagai tipe data yang khas, vektor secara inheren memiliki dimensi yang tinggi. Menyimpan vektor dalam memori adalah praktik yang umum dilakukan untuk kinerja optimal, tetapi volume data yang meningkat membatasi memori yang tersedia. Milvus mengoptimalkan penggunaan memori dengan mengadopsi teknik-teknik seperti <a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">MMap</a> dan DiskANN.</p>
<p>Namun, mencapai penggunaan memori yang rendah, kinerja yang sangat baik, dan akurasi yang tinggi secara bersamaan dalam sistem basis data tetaplah rumit, sehingga membutuhkan pertukaran antara kinerja dan akurasi untuk meminimalkan overhead memori.</p>
<p>Dalam kasus Artificial Intelligence Generated Content (AIGC), para pengembang biasanya memprioritaskan respon yang cepat dan akurasi hasil daripada persyaratan kinerja yang ketat. Penambahan MMap dan DiskANN dari Milvus meminimalkan penggunaan memori sekaligus memaksimalkan pemrosesan data dan akurasi hasil, memberikan keseimbangan yang selaras dengan kebutuhan praktis aplikasi AIGC.</p>
<h2 id="4-Insert--smooth-sailing-through-data-insertion" class="common-anchor-header">#4 Insert - penyisipan data dengan lancar<button data-href="#4-Insert--smooth-sailing-through-data-insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Penyisipan data yang efisien merupakan perhatian penting bagi para pengembang, yang memicu diskusi yang sering dilakukan untuk mengoptimalkan kecepatan penyisipan dalam komunitas Milvus. Milvus unggul dalam penyisipan data streaming yang efisien dan pembuatan indeks, berkat pemisahan data streaming dan batch yang mahir. Kemampuan ini menjadikannya sebagai solusi yang sangat berkinerja tinggi dibandingkan dengan penyedia basis data vektor lainnya, seperti Pinecone.</p>
<p>Berikut adalah beberapa wawasan dan rekomendasi berharga tentang penyisipan data:</p>
<ul>
<li><p><strong>Penyisipan Batch:</strong> Pilihlah penyisipan batch daripada penyisipan baris tunggal untuk meningkatkan efisiensi. Khususnya, penyisipan dari file melampaui penyisipan batch dalam hal kecepatan. Ketika menangani kumpulan data besar yang melebihi sepuluh juta catatan, pertimbangkan untuk menggunakan antarmuka <code translate="no">bulk_insert</code> untuk proses impor yang efisien dan cepat.</p></li>
<li><p><strong>Penggunaan <code translate="no">flush()</code> yang strategis:</strong> Daripada memanggil antarmuka <code translate="no">flush()</code> setelah setiap batch, lakukan satu panggilan setelah menyelesaikan semua penyisipan data. Penggunaan antarmuka <code translate="no">flush()</code> yang berlebihan di antara batch dapat menyebabkan pembuatan file segmen yang terfragmentasi, menempatkan beban pemadatan yang cukup besar pada sistem.</p></li>
<li><p><strong>Deduplikasi Kunci Utama:</strong> Milvus tidak melakukan deduplikasi kunci utama ketika menggunakan antarmuka <code translate="no">insert</code> untuk penyisipan data. Jika Anda perlu mendeduplikasi kunci primer, kami sarankan Anda menggunakan antarmuka <code translate="no">upsert</code>. Namun, kinerja penyisipan <code translate="no">upsert</code>lebih rendah daripada <code translate="no">insert</code>, karena adanya operasi kueri internal tambahan.</p></li>
</ul>
<h2 id="5-Configuration--decoding-the-parameter-maze" class="common-anchor-header">Konfigurasi #5 - memecahkan kode labirin parameter<button data-href="#5-Configuration--decoding-the-parameter-maze" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah basis data vektor terdistribusi yang mengintegrasikan banyak komponen pihak ketiga seperti penyimpanan objek, antrian pesan, dan Etcd. Pengguna bergulat dengan menyesuaikan parameter dan memahami dampaknya terhadap kinerja Milvus, membuat "Konfigurasi" menjadi topik yang sering dibahas.</p>
<p>Di antara semua pertanyaan tentang konfigurasi, "parameter mana yang harus disesuaikan" bisa dibilang merupakan aspek yang paling menantang, karena parameter bervariasi dalam situasi yang berbeda. Misalnya, mengoptimalkan parameter kinerja pencarian berbeda dengan mengoptimalkan parameter kinerja penyisipan dan sangat bergantung pada pengalaman praktis.</p>
<p>Setelah pengguna mengidentifikasi "parameter mana yang harus disesuaikan," pertanyaan berikutnya tentang "bagaimana cara menyesuaikan" menjadi lebih mudah dikelola. Untuk prosedur spesifik, lihat dokumentasi kami <a href="https://milvus.io/docs/configure-helm.md">Mengkonfigurasi Milvus</a>. Kabar baiknya adalah bahwa Milvus telah mendukung penyesuaian parameter dinamis sejak versi 2.3.0, sehingga tidak perlu memulai ulang agar perubahan dapat diterapkan. Untuk prosedur spesifik, lihat <a href="https://milvus.io/docs/dynamic_config.md">Mengkonfigurasi Milvus</a> dengan <a href="https://milvus.io/docs/dynamic_config.md">Cepat</a>.</p>
<h2 id="6-Logs--navigating-the-troubleshooting-compass" class="common-anchor-header">Log #6 - menavigasi kompas pemecahan masalah<button data-href="#6-Logs--navigating-the-troubleshooting-compass" class="anchor-icon" translate="no">
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
    </button></h2><p>"Log" berfungsi sebagai kompas pemecah masalah. Para pengguna mencari panduan di komunitas untuk mengekspor log Milvus, menyesuaikan level log, dan mengintegrasikannya dengan sistem seperti Loki dari Grafana. Berikut adalah beberapa saran tentang log Milvus.</p>
<ul>
<li><p><strong>Cara melihat dan mengekspor log Milvus:</strong> Anda dapat dengan mudah mengekspor log Milvus dengan skrip sekali klik <a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">export-milvus-log.sh</a> yang tersedia di repositori GitHub.</p></li>
<li><p><strong>Level log:</strong> Milvus memiliki beberapa level log untuk mengakomodasi beragam kasus penggunaan. Level info sudah cukup untuk sebagian besar kasus, dan level debug untuk debugging. Kelebihan log Milvus dapat menandakan level log yang salah konfigurasi.</p></li>
<li><p><strong>Kami merekomendasikan untuk mengintegrasikan log Milvus dengan sistem pengumpulan log</strong> seperti Loki untuk pengambilan log yang efisien dalam pemecahan masalah di masa mendatang.</p></li>
</ul>
<h2 id="7-Cluster--scaling-for-production-environments" class="common-anchor-header">Cluster #7 - penskalaan untuk lingkungan produksi<button data-href="#7-Cluster--scaling-for-production-environments" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengingat identitas Milvus sebagai basis data vektor terdistribusi, istilah "cluster" sering menjadi topik diskusi di komunitas. Pembicaraan berkisar pada penskalaan data dalam cluster, migrasi data, serta pencadangan dan sinkronisasi data.</p>
<p>Dalam lingkungan produksi, skalabilitas yang kuat dan ketersediaan yang tinggi adalah persyaratan standar untuk sistem database terdistribusi. Arsitektur pemisahan penyimpanan-komputasi Milvus memungkinkan skalabilitas data tanpa batas dengan memperluas sumber daya untuk node komputasi dan penyimpanan, mengakomodasi skala data tanpa batas. Milvus juga menyediakan ketersediaan tinggi dengan arsitektur multi-replika dan kemampuan pencadangan dan sinkronisasi yang kuat.  Untuk informasi lebih lanjut, lihat <a href="https://milvus.io/docs/coordinator_ha.md#Coordinator-HA">Koordinator HA</a>.</p>
<h2 id="8-Documentation--the-gateway-to-understanding-Milvus" class="common-anchor-header">#8 Dokumentasi - pintu gerbang untuk memahami Milvus<button data-href="#8-Documentation--the-gateway-to-understanding-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>"Dokumentasi" adalah kata kunci lain yang sering muncul dalam diskusi komunitas, yang sering kali terkait dengan pertanyaan tentang apakah ada halaman dokumentasi untuk fitur tertentu dan di mana menemukannya.</p>
<p>Berfungsi sebagai pintu gerbang untuk memahami Milvus, sekitar 80% dari pertanyaan komunitas menemukan jawabannya dalam <a href="https://milvus.io/docs">dokumentasi resmi</a>. Kami menyarankan Anda untuk membaca dokumentasi kami sebelum menggunakan Milvus atau mengalami masalah apa pun. Selain itu, Anda dapat menjelajahi contoh kode di berbagai repositori SDK untuk mendapatkan wawasan dalam menggunakan Milvus.</p>
<h2 id="9-Deployment--simplifying-the-Milvus-journey" class="common-anchor-header">#9 Penerapan - menyederhanakan perjalanan Milvus<button data-href="#9-Deployment--simplifying-the-Milvus-journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Penerapan yang sederhana tetap menjadi tujuan tim Milvus yang berkelanjutan. Untuk memenuhi komitmen ini, kami memperkenalkan <a href="https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite">Milvus Lite</a>, sebuah alternatif ringan untuk Milvus yang berfungsi penuh tetapi tidak memiliki ketergantungan pada K8 atau Docker.</p>
<p>Kami semakin menyederhanakan penerapan dengan memperkenalkan solusi pesan <a href="https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging">NATS</a> yang lebih ringan dan mengkonsolidasikan komponen node. Menanggapi umpan balik dari pengguna, kami bersiap untuk merilis versi mandiri tanpa ketergantungan, dengan upaya berkelanjutan untuk meningkatkan fitur dan menyederhanakan operasi penyebaran. Iterasi cepat dari Milvus menunjukkan komitmen berkelanjutan dari komunitas untuk terus menyempurnakan proses penerapan.</p>
<h2 id="10-Deletion--unraveling-the-impact" class="common-anchor-header">Penghapusan #10 - mengungkap dampaknya<button data-href="#10-Deletion--unraveling-the-impact" class="anchor-icon" translate="no">
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
    </button></h2><p>Diskusi umum tentang "penghapusan" berkisar pada jumlah data yang tidak berubah setelah penghapusan, kemampuan untuk mengambil data yang telah dihapus, dan kegagalan pemulihan ruang disk setelah penghapusan.</p>
<p>Milvus 2.3 memperkenalkan ekspresi <code translate="no">count(*)</code> untuk menangani pembaruan jumlah entitas yang tertunda. Bertahannya data yang dihapus dalam kueri mungkin disebabkan oleh penggunaan <a href="https://zilliz.com/blog/understand-consistency-models-for-vector-databases">model konsistensi data</a> yang tidak tepat. Kegagalan pemulihan ruang disk menjadi perhatian untuk mendesain ulang mekanisme pengumpulan sampah Milvus, yang menetapkan waktu tunggu sebelum penghapusan data secara keseluruhan. Pendekatan ini memungkinkan adanya jendela waktu untuk pemulihan potensial.</p>
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
    </button></h2><p>10 kata kunci teratas menawarkan sekilas gambaran tentang diskusi yang dinamis di dalam komunitas Milvus. Seiring dengan perkembangan Milvus, komunitas ini tetap menjadi sumber daya yang tak ternilai bagi para pengembang yang mencari solusi, berbagi pengalaman, dan berkontribusi untuk memajukan basis data vektor di era AI.</p>
<p>Bergabunglah dalam perjalanan yang menarik ini dengan bergabung di <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami pada tahun 2024. Di sana, Anda dapat berinteraksi dengan para insinyur brilian kami dan terhubung dengan para penggemar Milvus yang berpikiran sama. Selain itu, hadiri acara <a href="https://discord.com/invite/RjNbk8RR4f">Makan Si</a> ang <a href="https://discord.com/invite/RjNbk8RR4f">dan Belajar Komunitas Milvus</a> setiap hari Selasa pukul 12:00-12:30 PST. Bagikan pemikiran, pertanyaan, dan umpan balik Anda, karena setiap kontribusi akan menambah semangat kolaboratif yang mendorong Milvus untuk maju. Partisipasi aktif Anda tidak hanya disambut baik, tetapi juga dihargai. Mari berinovasi bersama!</p>
