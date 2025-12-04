---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: >-
  Penghancuran JSON di Milvus: Pemfilteran JSON 88,9x Lebih Cepat dengan
  Fleksibilitas
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/Milvus_Week_JSON_Shredding_cover_829a12b086.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Temukan bagaimana Milvus JSON Shredding menggunakan penyimpanan kolom yang
  dioptimalkan untuk mempercepat kueri JSON hingga 89× sambil mempertahankan
  fleksibilitas skema penuh.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>Sistem AI modern menghasilkan lebih banyak data JSON semi-terstruktur daripada sebelumnya. Informasi pelanggan dan produk dipadatkan ke objek JSON, layanan mikro memancarkan log JSON pada setiap permintaan, perangkat IoT mengalirkan pembacaan sensor dalam muatan JSON yang ringan, dan aplikasi AI saat ini semakin terstandardisasi pada JSON untuk keluaran terstruktur. Hasilnya adalah banjir data seperti JSON yang mengalir ke dalam basis data vektor.</p>
<p>Secara tradisional, ada dua cara untuk menangani dokumen JSON:</p>
<ul>
<li><p><strong>Menentukan setiap bidang JSON ke dalam skema tetap dan membangun indeks:</strong> Pendekatan ini memberikan kinerja kueri yang solid, tetapi kaku. Setelah format data berubah, setiap bidang yang baru atau dimodifikasi akan memicu pembaruan Data Definition Language (DDL) dan migrasi skema yang menyakitkan.</p></li>
<li><p><strong>Menyimpan seluruh objek JSON sebagai satu kolom (baik tipe JSON maupun Skema Dinamis di Milvus menggunakan pendekatan ini):</strong> Opsi ini menawarkan fleksibilitas yang sangat baik, tetapi dengan mengorbankan kinerja kueri. Setiap permintaan membutuhkan penguraian JSON pada saat runtime dan sering kali pemindaian tabel secara penuh, yang menghasilkan latensi yang meningkat seiring dengan bertambahnya kumpulan data.</p></li>
</ul>
<p>Dulu ini merupakan dilema antara fleksibilitas dan kinerja.</p>
<p>Tidak lagi dengan fitur JSON Shredding yang baru diperkenalkan di <a href="https://milvus.io/">Milvus</a>.</p>
<p>Dengan diperkenalkannya <a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a>, Milvus sekarang mencapai kelincahan bebas skema dengan kinerja penyimpanan kolumnar, yang pada akhirnya membuat data semi-terstruktur berskala besar menjadi fleksibel dan ramah terhadap kueri.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">Cara Kerja Penghancuran JSON<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Penghancuran JSON mempercepat kueri JSON dengan mengubah dokumen JSON berbasis baris menjadi penyimpanan kolumnar yang sangat dioptimalkan. Milvus mempertahankan fleksibilitas JSON untuk pemodelan data sambil secara otomatis mengoptimalkan penyimpanan kolumnar-secara signifikan meningkatkan akses data dan kinerja kueri.</p>
<p>Untuk menangani bidang JSON yang jarang atau langka secara efisien, Milvus juga memiliki indeks terbalik untuk kunci bersama. Semua ini terjadi secara transparan kepada pengguna: Anda dapat memasukkan dokumen JSON seperti biasa, dan menyerahkannya kepada Milvus untuk mengelola strategi penyimpanan dan pengindeksan yang optimal secara internal.</p>
<p>Ketika Milvus menerima catatan JSON mentah dengan berbagai bentuk dan struktur, Milvus menganalisis setiap kunci JSON untuk rasio kemunculan dan stabilitas jenisnya (apakah jenis datanya konsisten di seluruh dokumen). Berdasarkan analisis ini, setiap kunci diklasifikasikan ke dalam salah satu dari tiga kategori:</p>
<ul>
<li><p><strong>Kunci yang diketik:</strong> Kunci yang muncul di sebagian besar dokumen dan selalu memiliki tipe data yang sama (misalnya, semua bilangan bulat atau semua string).</p></li>
<li><p><strong>Kunci dinamis</strong>: Kunci yang sering muncul namun memiliki tipe data campuran (misalnya, terkadang berupa string, terkadang berupa bilangan bulat).</p></li>
<li><p><strong>Kunci bersama:</strong> Kunci yang jarang muncul, jarang, atau bersarang, berada di bawah ambang batas frekuensi yang dapat dikonfigurasi.</p></li>
</ul>
<p>Milvus menangani setiap kategori secara berbeda untuk memaksimalkan efisiensi:</p>
<ul>
<li><p><strong>Tombol</strong> yang diketik disimpan dalam kolom khusus yang diketik dengan kuat.</p></li>
<li><p><strong>Kunci dinamis</strong> ditempatkan ke dalam kolom dinamis berdasarkan jenis nilai aktual yang diamati pada saat runtime.</p></li>
<li><p>Baik kolom yang diketik maupun kolom dinamis disimpan dalam format kolom Panah/Partikel untuk pemindaian cepat dan eksekusi kueri yang sangat dioptimalkan.</p></li>
<li><p><strong>Kunci bersama</strong> dikonsolidasikan ke dalam kolom biner-JSON yang ringkas, disertai dengan indeks terbalik kunci bersama. Indeks ini mempercepat kueri pada bidang berfrekuensi rendah dengan memangkas baris yang tidak relevan lebih awal dan membatasi pencarian hanya pada dokumen yang mengandung kunci yang ditanyakan.</p></li>
</ul>
<p>Kombinasi penyimpanan kolumnar adaptif dan pengindeksan terbalik ini merupakan inti dari mekanisme penghancuran JSON Milvus, yang memungkinkan fleksibilitas dan kinerja tinggi dalam skala besar.</p>
<p>Alur kerja keseluruhan diilustrasikan di bawah ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sekarang setelah kita membahas dasar-dasar cara kerja penghancuran JSON, mari kita lihat lebih dekat kemampuan utama yang membuat pendekatan ini fleksibel dan berkinerja tinggi.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">Penghancuran dan Kolomisasi</h3><p>Ketika sebuah dokumen JSON baru ditulis, Milvus memecahnya dan mengaturnya kembali ke dalam penyimpanan kolom yang dioptimalkan:</p>
<ul>
<li><p>Kunci yang diketik dan dinamis secara otomatis diidentifikasi dan disimpan dalam kolom khusus.</p></li>
<li><p>Jika JSON berisi objek bersarang, Milvus menghasilkan nama kolom berbasis jalur secara otomatis. Sebagai contoh, kolom <code translate="no">name</code> di dalam objek <code translate="no">user</code> dapat disimpan dengan nama kolom <code translate="no">/user/name</code>.</p></li>
<li><p>Kunci yang digunakan bersama disimpan bersama dalam satu kolom JSON biner yang ringkas. Karena kunci-kunci ini jarang muncul, Milvus membuat indeks terbalik untuk kunci-kunci tersebut, sehingga memungkinkan pemfilteran yang cepat dan memungkinkan sistem untuk dengan cepat menemukan baris yang berisi kunci yang ditentukan.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">Manajemen Kolom Cerdas</h3><p>Selain merobek-robek JSON menjadi kolom-kolom, Milvus menambahkan lapisan kecerdasan tambahan melalui manajemen kolom yang dinamis, memastikan bahwa penghancuran JSON tetap fleksibel seiring perkembangan data.</p>
<ul>
<li><p><strong>Kolom dibuat sesuai kebutuhan:</strong> Ketika kunci baru muncul dalam dokumen JSON yang masuk, Milvus secara otomatis mengelompokkan nilai dengan kunci yang sama ke dalam kolom khusus. Hal ini mempertahankan keunggulan kinerja penyimpanan kolom tanpa mengharuskan pengguna merancang skema di awal. Milvus juga menyimpulkan tipe data dari kolom baru (misalnya, INTEGER, DOUBLE, VARCHAR) dan memilih format kolom yang efisien untuk kolom tersebut.</p></li>
<li><p><strong>Setiap kunci ditangani secara otomatis:</strong> Milvus menganalisis dan memproses setiap kunci dalam dokumen JSON. Hal ini memastikan cakupan kueri yang luas tanpa memaksa pengguna untuk menentukan bidang atau membangun indeks terlebih dahulu.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">Pengoptimalan Kueri</h3><p>Setelah data disusun ulang ke dalam kolom yang tepat, Milvus memilih jalur eksekusi yang paling efisien untuk setiap kueri:</p>
<ul>
<li><p><strong>Pemindaian kolom langsung untuk kunci yang diketik dan kunci dinamis:</strong> Jika kueri menargetkan bidang yang telah dipecah menjadi kolom tersendiri, Milvus dapat memindai kolom tersebut secara langsung. Hal ini mengurangi jumlah total data yang perlu diproses dan memanfaatkan komputasi kolom yang dipercepat oleh SIMD untuk eksekusi yang lebih cepat.</p></li>
<li><p><strong>Pencarian terindeks untuk kunci bersama:</strong> Jika kueri melibatkan kolom yang tidak dipromosikan ke dalam kolomnya sendiri-biasanya merupakan kunci yang langka-Milvus mengevaluasinya terhadap kolom kunci bersama. Indeks terbalik yang dibangun di atas kolom ini memungkinkan Milvus dengan cepat mengidentifikasi baris mana yang berisi kunci yang ditentukan dan melewatkan sisanya, sehingga secara signifikan meningkatkan kinerja untuk bidang-bidang yang berfrekuensi rendah.</p></li>
<li><p><strong>Manajemen metadata otomatis:</strong> Milvus secara terus menerus mengelola metadata dan kamus global sehingga kueri tetap akurat dan efisien, bahkan ketika struktur dokumen JSON yang masuk berevolusi dari waktu ke waktu.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">Tolok ukur kinerja<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami merancang tolok ukur untuk membandingkan performa kueri dalam menyimpan seluruh dokumen JSON sebagai satu field mentah dibandingkan dengan menggunakan fitur JSON Shredding yang baru saja dirilis.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">Lingkungan dan metodologi pengujian</h3><ul>
<li><p>Perangkat keras: 1 inti / 8GB cluster</p></li>
<li><p>Dataset: 1 juta dokumen dari <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a></p></li>
<li><p>Metodologi: Mengukur QPS dan latensi di berbagai pola kueri yang berbeda</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">Hasil: kunci yang diketik</h3><p>Pengujian ini mengukur performa saat meng-query kunci yang ada di sebagian besar dokumen.</p>
<table>
<thead>
<tr><th>Ekspresi Kueri</th><th>QPS (tanpa penghancuran)</th><th>QPS (dengan penghancuran)</th><th>Peningkatan Kinerja</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['jenis'] == 'komit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">Hasil: kunci bersama</h3><p>Pengujian ini berfokus pada kueri kunci bersarang yang jarang yang termasuk dalam kategori "bersama".</p>
<table>
<thead>
<tr><th>Ekspresi Kueri</th><th>QPS (tanpa penghancuran)</th><th>QPS (dengan penghancuran)</th><th>Peningkatan Kinerja</th></tr>
</thead>
<tbody>
<tr><td>json['identitas']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>Kueri shared-key menunjukkan peningkatan yang paling dramatis (hingga 89x lebih cepat), sementara kueri typed-key memberikan peningkatan kecepatan 15-30x secara konsisten. Secara keseluruhan, setiap jenis kueri mendapatkan manfaat dari JSON Shredding, dengan peningkatan kinerja yang jelas di seluruh bagian.</p>
<h2 id="Try-It-Now" class="common-anchor-header">Coba Sekarang<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Baik Anda bekerja dengan log API, data sensor IoT, atau muatan aplikasi yang berkembang pesat, JSON Shredding memberi Anda kemampuan langka untuk memiliki fleksibilitas dan kinerja tinggi.</p>
<p>Fitur ini sekarang sudah tersedia dan silakan mencobanya sekarang. Anda juga dapat melihat <a href="https://milvus.io/docs/json-shredding.md">dokumen ini</a> untuk informasi lebih lanjut.</p>
<p>Ada pertanyaan atau ingin mendalami fitur-fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga bisa memesan sesi one-on-one selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>Dan jika Anda ingin menjelajahi lebih jauh, nantikan pembahasan mendalam lainnya di seluruh seri Milvus Week kami.</p>
