---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - Pendeteksi Penipuan Foto Berdasarkan Milvus
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: >-
  Bagaimana sistem deteksi Zhentu dibangun dengan Milvus sebagai mesin pencari
  vektornya?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>gambar sampul</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh Yan Shi dan Minwei Tang, insinyur algoritme senior di BestPay, dan diterjemahkan oleh <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p>Dalam beberapa tahun terakhir, seiring dengan semakin lazimnya e-commerce dan transaksi online di seluruh dunia, penipuan e-commerce juga berkembang pesat. Dengan menggunakan foto yang dihasilkan komputer dan bukan foto asli untuk lolos verifikasi identitas pada platform bisnis online, penipu membuat akun palsu dalam jumlah besar dan menguangkan penawaran khusus bisnis (misalnya hadiah keanggotaan, kupon, token), yang menyebabkan kerugian yang tidak dapat diperbaiki baik bagi konsumen maupun bisnis.</p>
<p>Metode pengendalian risiko tradisional tidak lagi efektif dalam menghadapi sejumlah besar data. Untuk mengatasi masalah tersebut, <a href="https://www.bestpay.com.cn">BestPay</a> menciptakan pendeteksi penipuan foto, yaitu Zhentu (artinya mendeteksi gambar dalam bahasa Mandarin), berdasarkan teknologi deep learning (DL) dan digital image processing (DIP). Zhentu dapat digunakan untuk berbagai skenario yang melibatkan pengenalan gambar, dengan salah satu cabang penting adalah identifikasi izin usaha palsu. Jika foto izin usaha yang dikirimkan oleh pengguna sangat mirip dengan foto lain yang sudah ada di perpustakaan foto platform, kemungkinan besar pengguna telah mencuri foto tersebut di suatu tempat atau telah memalsukan lisensi untuk tujuan penipuan.</p>
<p>Algoritme tradisional untuk mengukur kemiripan gambar, seperti <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> dan ORB, lambat dan tidak akurat, dan hanya dapat digunakan untuk tugas-tugas offline. Di sisi lain, deep learning mampu memproses data gambar berskala besar secara real-time dan merupakan metode terbaik untuk mencocokkan gambar yang mirip. Dengan upaya bersama dari tim R&amp;D BestPay dan <a href="https://milvus.io/">komunitas Milvus</a>, sebuah sistem pendeteksi penipuan foto dikembangkan sebagai bagian dari Zhentu. Sistem ini berfungsi dengan mengubah data gambar dalam jumlah besar menjadi vektor fitur melalui model pembelajaran mendalam dan memasukkannya ke dalam <a href="https://milvus.io/">Milvus</a>, mesin pencari vektor. Dengan Milvus, sistem pendeteksi ini dapat mengindeks triliunan vektor dan secara efisien mengambil foto yang serupa di antara puluhan juta gambar.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Gambaran umum tentang Zhentu</a></li>
<li><a href="#system-structure">Struktur sistem</a></li>
<li><a href="#deployment"><strong>Penerapan</strong></a></li>
<li><a href="#real-world-performance"><strong>Kinerja dunia nyata</strong></a></li>
<li><a href="#reference"><strong>Referensi</strong></a></li>
<li><a href="#about-bestpay"><strong>Tentang BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Gambaran umum tentang Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu adalah produk kontrol risiko visual multimedia yang dirancang sendiri oleh BestPay yang terintegrasi secara mendalam dengan pembelajaran mesin (ML) dan teknologi pengenalan gambar jaringan saraf. Algoritme bawaannya dapat secara akurat mengidentifikasi penipu selama otentikasi pengguna dan merespons pada tingkat milidetik. Dengan teknologi terdepan di industri dan solusi inovatifnya, Zhentu telah memenangkan lima paten dan dua hak cipta perangkat lunak. Sekarang ini digunakan di sejumlah bank dan lembaga keuangan untuk membantu mengidentifikasi potensi risiko sebelumnya.</p>
<h2 id="System-structure" class="common-anchor-header">Struktur sistem<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPay saat ini memiliki lebih dari 10 juta foto izin usaha, dan volume aktualnya masih terus bertambah secara eksponensial seiring dengan pertumbuhan bisnis. Untuk mengambil foto yang mirip dengan cepat dari database yang begitu besar, Zhentu telah memilih Milvus sebagai mesin penghitung kemiripan vektor fitur. Struktur umum sistem deteksi penipuan foto ditunjukkan pada diagram di bawah ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Prosedurnya dapat dibagi menjadi empat langkah:</p>
<ol>
<li><p>Pra-pemrosesan gambar. Pra-pemrosesan, termasuk pengurangan noise, penghilangan noise, dan peningkatan kontras, memastikan integritas informasi asli dan penghilangan informasi yang tidak berguna dari sinyal gambar.</p></li>
<li><p>Ekstraksi vektor fitur. Model pembelajaran mendalam yang dilatih secara khusus digunakan untuk mengekstrak vektor fitur gambar. Mengubah gambar menjadi vektor untuk pencarian kemiripan lebih lanjut adalah operasi rutin.</p></li>
<li><p>Normalisasi. Normalisasi vektor fitur yang diekstraksi membantu meningkatkan efisiensi pemrosesan selanjutnya.</p></li>
<li><p>Pencarian vektor dengan Milvus. Memasukkan vektor fitur yang telah dinormalisasi ke dalam basis data Milvus untuk pencarian kemiripan vektor.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>Penerapan</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Berikut ini adalah penjelasan singkat tentang bagaimana sistem pendeteksi penipuan foto Zhentu digunakan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur sistem Milvus</span> </span></p>
<p>Kami menerapkan <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">cluster Milvus</a> kami <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">di Kubernetes</a> untuk memastikan ketersediaan tinggi dan sinkronisasi layanan cloud secara real-time. Langkah-langkah umumnya adalah sebagai berikut:</p>
<ol>
<li><p>Lihat sumber daya yang tersedia. Jalankan perintah <code translate="no">kubectl describe nodes</code> untuk melihat sumber daya yang dapat dialokasikan oleh klaster Kubernetes ke kasus yang dibuat.</p></li>
<li><p>Alokasikan sumber daya. Jalankan perintah <code translate="no">kubect`` -- apply xxx.yaml</code> untuk mengalokasikan sumber daya memori dan CPU untuk komponen cluster Milvus menggunakan Helm.</p></li>
<li><p>Menerapkan konfigurasi baru. Jalankan perintah <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code>.</p></li>
<li><p>Terapkan konfigurasi baru ke cluster Milvus. Cluster yang digunakan dengan cara ini tidak hanya memungkinkan kita untuk menyesuaikan kapasitas sistem sesuai dengan kebutuhan bisnis yang berbeda, tetapi juga memenuhi persyaratan kinerja tinggi untuk pengambilan data vektor yang sangat besar.</p></li>
</ol>
<p>Anda dapat <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">mengonfigurasi Milvus</a> untuk mengoptimalkan kinerja pencarian untuk berbagai jenis data dari skenario bisnis yang berbeda, seperti yang ditunjukkan dalam dua contoh berikut.</p>
<p>Dalam <a href="https://milvus.io/docs/v2.0.x/build_index.md">membangun indeks vektor</a>, kami memparameterkan indeks sesuai dengan skenario sistem yang sebenarnya sebagai berikut:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a> melakukan pengelompokan indeks IVF sebelum mengkuantifikasi hasil kali vektor. Ini fitur permintaan disk berkecepatan tinggi dan konsumsi memori yang sangat rendah, yang memenuhi kebutuhan aplikasi dunia nyata Zhentu.</p>
<p>Selain itu, kami menetapkan parameter pencarian optimal sebagai berikut:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>Karena vektor sudah dinormalisasi sebelum dimasukkan ke dalam Milvus, inner product (IP) dipilih untuk menghitung jarak antara dua vektor. Eksperimen telah membuktikan bahwa tingkat penarikan kembali meningkat sekitar 15% dengan menggunakan IP dibandingkan dengan menggunakan jarak Euclidean (L2).</p>
<p>Contoh-contoh di atas menunjukkan bahwa kita dapat menguji dan mengatur parameter Milvus sesuai dengan skenario bisnis dan persyaratan kinerja yang berbeda.</p>
<p>Selain itu, Milvus tidak hanya mengintegrasikan pustaka indeks yang berbeda, tetapi juga mendukung berbagai jenis indeks dan metode penghitungan kemiripan. Milvus juga menyediakan SDK resmi dalam berbagai bahasa dan API yang kaya untuk penyisipan, kueri, dll., yang memungkinkan grup bisnis front-end kami untuk menggunakan SDK untuk memanggil pusat kendali risiko.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>Performa dunia nyata</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Sejauh ini, sistem pendeteksi penipuan foto telah berjalan dengan mantap, membantu bisnis untuk mengidentifikasi calon penipu. Pada tahun 2021, sistem ini mendeteksi lebih dari 20.000 lisensi palsu sepanjang tahun. Dalam hal kecepatan kueri, kueri vektor tunggal di antara puluhan juta vektor membutuhkan waktu kurang dari 1 detik, dan waktu rata-rata kueri batch kurang dari 0,08 detik. Pencarian berkinerja tinggi dari Milvus memenuhi kebutuhan bisnis akan akurasi dan konkurensi.</p>
<h2 id="Reference" class="common-anchor-header"><strong>Referensi</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Implementasi Metode Ekstraksi Fitur Berkinerja Tinggi Menggunakan Algoritma Berorientasi Cepat dan Berputar Singkat [J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>Tentang BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>China Telecom BestPay Co, Ltd adalah anak perusahaan yang sepenuhnya dimiliki oleh China Telecom. Perusahaan ini mengoperasikan bisnis pembayaran dan keuangan. BestPay berkomitmen untuk menggunakan teknologi mutakhir seperti data besar, kecerdasan buatan, dan komputasi awan untuk memberdayakan inovasi bisnis, menyediakan produk cerdas, solusi pengendalian risiko, dan layanan lainnya. Hingga Januari 2016, aplikasi BestPay telah menarik lebih dari 200 juta pengguna dan menjadi operator platform pembayaran terbesar ketiga di Tiongkok, setelah Alipay dan WeChat Payment.</p>
