---
id: what-milvus-taught-us-in-2024.md
title: Apa yang Diajarkan Pengguna Milvus kepada Kami di Tahun 2024
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: >-
  Lihat pertanyaan-pertanyaan yang paling sering diajukan tentang Milvus di
  Discord kami.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">Gambaran Umum<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika Milvus berkembang pesat pada tahun 2024 dengan rilis-rilis besar dan ekosistem open-source yang berkembang pesat, sebuah harta karun tersembunyi berupa wawasan pengguna diam-diam terbentuk dalam komunitas kami di <a href="https://discord.gg/xwqmFDURcz">Discord</a>. Kompilasi diskusi komunitas ini memberikan kesempatan unik untuk memahami tantangan pengguna kami secara langsung. Karena penasaran dengan sumber daya yang belum dimanfaatkan ini, saya memulai analisis komprehensif terhadap setiap utas diskusi dari tahun tersebut, mencari pola yang dapat membantu kami menyusun sumber daya pertanyaan umum untuk pengguna Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Analisis saya mengungkapkan tiga area utama di mana pengguna secara konsisten mencari panduan: <strong>Optimalisasi Kinerja</strong>, <strong>Strategi Penerapan</strong>, dan <strong>Manajemen Data</strong>. Para pengguna sering mendiskusikan cara menyempurnakan Milvus untuk lingkungan produksi dan melacak metrik kinerja secara efektif. Dalam hal penerapan, komunitas bergulat dengan pemilihan penerapan yang sesuai, memilih indeks pencarian yang optimal, dan menyelesaikan masalah dalam pengaturan terdistribusi. Pembicaraan manajemen data berpusat pada strategi migrasi data dari layanan ke layanan dan pemilihan model penyematan.</p>
<p>Mari kita bahas masing-masing area ini secara lebih rinci.</p>
<h2 id="Deployment" class="common-anchor-header">Penerapan<button data-href="#Deployment" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus menyediakan mode penerapan yang fleksibel agar sesuai dengan berbagai kasus penggunaan. Namun, beberapa pengguna merasa kesulitan untuk menemukan pilihan yang tepat, dan ingin merasa nyaman bahwa mereka melakukannya dengan "benar".</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">Jenis penerapan mana yang harus saya pilih?</h3><p>Pertanyaan yang sangat sering muncul adalah deployment mana yang harus dipilih dari Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a>, dan <a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a>. Jawabannya terutama tergantung pada seberapa besar database vektor Anda dan berapa banyak lalu lintas yang akan dilayani:</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>Ketika membuat prototipe pada sistem lokal Anda dengan hingga beberapa juta vektor, atau mencari db vektor tertanam untuk pengujian unit dan CI/CD, Anda dapat menggunakan Milvus Lite. Harap dicatat bahwa beberapa fitur yang lebih canggih seperti pencarian teks lengkap belum tersedia di Milvus Lite, tetapi akan segera hadir.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h4><p>Jika sistem Anda perlu melayani lalu lintas produksi dan/atau Anda perlu menyimpan antara beberapa juta hingga seratus juta vektor, Anda harus menggunakan Milvus Standalone, yang mengemas semua komponen Milvus ke dalam satu citra Docker. Ada variasi yang hanya mengambil ketergantungan penyimpanan persisten (minio) dan penyimpanan metadata (etcd) sebagai citra terpisah.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus Didistribusikan</h4><p>Untuk penerapan skala yang lebih besar yang melayani lalu lintas produksi, seperti melayani miliaran vektor pada ribuan QPS, Anda harus menggunakan Milvus Distributed. Beberapa pengguna mungkin ingin melakukan pemrosesan batch offline dalam skala besar, misalnya, untuk deduplikasi data atau penautan rekaman, dan versi Milvus 3.0 yang akan datang akan menyediakan cara yang lebih efisien untuk melakukan hal ini melalui apa yang kami sebut sebagai danau vektor.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">Layanan yang Dikelola Sepenuhnya</h4><p>Bagi para pengembang yang ingin fokus pada pengembangan aplikasi tanpa mengkhawatirkan DevOps, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> adalah Milvus yang dikelola sepenuhnya yang menawarkan tingkat gratis.</p>
<p>Lihat <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Gambaran Umum Penerapan Milvus"</a> untuk informasi lebih lanjut.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">Berapa banyak memori, penyimpanan, dan komputasi yang saya perlukan?</h3><p>Pertanyaan ini sering muncul, tidak hanya untuk pengguna Milvus yang sudah ada tetapi juga mereka yang sedang mempertimbangkan apakah Milvus sesuai untuk aplikasi mereka. Kombinasi yang tepat dari berapa banyak memori, penyimpanan, dan komputasi yang dibutuhkan oleh sebuah penerapan bergantung pada interaksi yang kompleks dari berbagai faktor.</p>
<p>Penyematan vektor berbeda dalam hal dimensi karena model yang digunakan. Dan beberapa indeks pencarian vektor disimpan sepenuhnya di memori, sedangkan yang lain menyimpan data ke disk. Selain itu, banyak indeks pencarian yang dapat menyimpan salinan terkompresi (terkuantisasi) dari embedding dan membutuhkan memori tambahan untuk struktur data grafik. Ini hanyalah beberapa faktor yang mempengaruhi memori dan penyimpanan.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Alat Pengukur Ukuran Sumber Daya Milvus</h4><p>Untungnya, Zilliz (tim yang mengelola Milvus) telah membuat <a href="https://milvus.io/tools/sizing">alat ukuran sumber daya</a> yang melakukan pekerjaan yang luar biasa untuk menjawab pertanyaan ini. Masukkan dimensi vektor Anda, jenis indeks, opsi penerapan, dan seterusnya dan alat ini akan memperkirakan CPU, memori, dan penyimpanan yang dibutuhkan di berbagai jenis node Milvus dan ketergantungannya. Jarak tempuh Anda mungkin berbeda-beda, jadi pengujian beban nyata dengan data dan lalu lintas sampel selalu merupakan ide yang bagus.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">Indeks vektor atau metrik jarak mana yang harus saya pilih?</h3><p>Banyak pengguna yang tidak yakin indeks mana yang harus mereka pilih dan bagaimana cara mengatur hiperparameter. Pertama, Anda selalu dapat menyerahkan pilihan jenis indeks kepada Milvus dengan memilih AUTOINDEX. Namun, jika Anda ingin memilih jenis indeks tertentu, beberapa aturan praktis dapat menjadi titik awal.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">Indeks Dalam Memori</h4><p>Apakah Anda ingin membayar biaya untuk memasukkan indeks Anda sepenuhnya ke dalam memori? Indeks dalam memori biasanya merupakan yang tercepat tetapi juga mahal. Lihat <a href="https://milvus.io/docs/index.md?tab=floating">"Indeks dalam memori"</a> untuk daftar <a href="https://milvus.io/docs/index.md?tab=floating">indeks</a> yang didukung oleh Milvus dan pengorbanannya dalam hal latensi, memori, dan pemanggilan.</p>
<p>Perlu diingat bahwa ukuran indeks Anda bukan hanya jumlah vektor dikalikan dengan dimensi dan ukuran floating point. Sebagian besar indeks mengkuantifikasi vektor untuk mengurangi penggunaan memori, tetapi membutuhkan memori untuk struktur data tambahan. Data non-vektor lainnya (skalar) dan indeksnya juga membutuhkan ruang memori.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">Indeks Pada Disk</h4><p>Ketika indeks Anda tidak muat dalam memori, Anda dapat menggunakan salah satu dari <a href="https://milvus.io/docs/disk_index.md">"Indeks pada disk"</a> yang disediakan oleh Milvus. Dua pilihan dengan latensi/sumber daya yang sangat berbeda adalah <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> dan <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a>.</p>
<p>DiskANN menyimpan salinan vektor yang sangat terkompresi dalam memori, dan vektor yang tidak terkompresi dan struktur pencarian grafik pada disk. DiskANN menggunakan beberapa ide cerdas untuk mencari ruang vektor sambil meminimalkan pembacaan disk dan memanfaatkan kecepatan akses acak yang cepat dari SSD. Untuk latensi minimum, SSD harus dihubungkan melalui NVMe, bukan SATA untuk performa I/O terbaik.</p>
<p>Secara teknis, MMap bukanlah jenis indeks, tetapi mengacu pada penggunaan memori virtual dengan indeks dalam memori. Dengan memori virtual, halaman dapat ditukar antara disk dan RAM sesuai kebutuhan, yang memungkinkan indeks yang jauh lebih besar digunakan secara efisien jika pola akses sedemikian rupa sehingga hanya sebagian kecil data yang digunakan pada satu waktu.</p>
<p>DiskANN memiliki latensi yang sangat baik dan konsisten. MMap memiliki latensi yang lebih baik lagi ketika mengakses halaman dalam memori, tetapi penukaran halaman yang sering dilakukan akan menyebabkan lonjakan latensi. Dengan demikian, MMap dapat memiliki variabilitas latensi yang lebih tinggi, tergantung pada pola akses memori.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">Indeks GPU</h4><p>Opsi ketiga adalah membangun <a href="https://milvus.io/docs/gpu_index.md">indeks menggunakan memori GPU dan menghitung</a>. Dukungan GPU Milvus dikontribusikan oleh tim Nvidia <a href="https://rapids.ai/">RAPIDS</a>. Pencarian vektor GPU mungkin memiliki latensi yang lebih rendah daripada pencarian CPU yang sesuai, meskipun biasanya dibutuhkan ratusan atau ribuan QPS pencarian untuk sepenuhnya mengeksploitasi paralelisme GPU. Selain itu, GPU biasanya memiliki memori yang lebih sedikit daripada RAM CPU dan lebih mahal untuk dijalankan.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">Metrik Jarak</h4><p>Pertanyaan yang lebih mudah untuk dijawab adalah metrik jarak mana yang sebaiknya Anda pilih untuk mengukur kesamaan antar vektor. Disarankan untuk memilih metrik jarak yang sama dengan yang digunakan untuk melatih model embedding Anda, yang biasanya berupa COSINE (atau IP ketika input dinormalisasi). Sumber model Anda (misalnya, halaman model di HuggingFace) akan memberikan klarifikasi tentang metrik jarak yang digunakan. Zilliz juga menyusun <a href="https://zilliz.com/ai-models">tabel</a> yang mudah untuk mencari tahu.</p>
<p>Sebagai rangkuman, saya pikir banyak ketidakpastian di sekitar pilihan indeks berkisar pada ketidakpastian tentang bagaimana pilihan-pilihan ini memengaruhi latensi/penggunaan sumber daya/pemanggilan kembali dari penerapan Anda. Saya sarankan untuk menggunakan aturan praktis di atas untuk memutuskan antara indeks in-memory, on-disk, atau GPU, dan kemudian menggunakan panduan tradeoff yang diberikan dalam dokumentasi Milvus untuk memilih salah satunya.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">Dapatkah Anda memperbaiki penerapan Milvus Distributed saya yang rusak?</h3><p>Banyak pertanyaan berkisar pada masalah dalam menyiapkan dan menjalankan penerapan Milvus Distributed, dengan pertanyaan yang berkaitan dengan konfigurasi, peralatan, dan log debugging. Sulit untuk memberikan solusi tunggal karena setiap pertanyaan tampaknya berbeda dari yang lain, meskipun untungnya Milvus memiliki <a href="https://milvus.io/discord">Discord yang dinamis</a> di mana Anda dapat mencari bantuan, dan kami juga menawarkan <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">jam kerja 1-on-1 dengan seorang ahli.</a></p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">Bagaimana cara menggunakan Milvus di Windows?</h3><p>Sebuah pertanyaan yang muncul beberapa kali adalah bagaimana cara menggunakan Milvus pada mesin Windows. Berdasarkan masukan dari Anda, kami telah menulis ulang dokumentasi untuk hal ini: lihat <a href="https://milvus.io/docs/install_standalone-windows.md">Menjalankan Milvus di Docker (Windows)</a> untuk mengetahui bagaimana cara melakukannya, menggunakan <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2</a>).</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">Kinerja dan Pembuatan Profil<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah memilih jenis deployment dan menjalankannya, pengguna ingin merasa nyaman bahwa mereka telah membuat keputusan yang optimal dan ingin membuat profil kinerja dan status deployment mereka. Banyak pertanyaan yang berkaitan dengan cara membuat profil kinerja, mengamati status, dan mendapatkan wawasan tentang apa dan mengapa.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">Bagaimana cara mengukur kinerja?</h3><p>Pengguna ingin memeriksa metrik yang terkait dengan kinerja penerapan mereka sehingga mereka dapat memahami dan memperbaiki kemacetan. Metrik yang disebutkan termasuk latensi kueri rata-rata, distribusi latensi, volume kueri, penggunaan memori, penyimpanan disk, dan sebagainya. Metrik-metrik ini dapat diamati dari <a href="https://milvus.io/docs/monitor_overview.md">sistem pemantauan</a>. Selain itu, Milvus 2.5 memperkenalkan alat baru yang disebut <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> (umpan balik selamat datang!), yang memungkinkan Anda untuk mengakses lebih banyak informasi internal sistem seperti status pemadatan segmen, dari antarmuka web yang mudah digunakan.</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">Apa yang sedang terjadi di dalam Milvus saat ini (misalnya, status pengamatan)?</h3><p>Terkait hal ini, pengguna ingin mengamati status internal dari penerapan mereka. Isu-isu yang diangkat termasuk memahami mengapa indeks pencarian membutuhkan waktu yang lama untuk dibuat, bagaimana menentukan apakah cluster itu sehat, dan memahami bagaimana kueri dieksekusi di seluruh node. Banyak dari pertanyaan-pertanyaan ini dapat dijawab dengan <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> baru yang memberikan transparansi terhadap apa yang dilakukan sistem secara internal.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">Bagaimana cara kerja beberapa aspek (kompleks) internal?</h3><p>Pengguna tingkat lanjut sering kali menginginkan pemahaman tentang internal Milvus, misalnya, memiliki pemahaman tentang penyegelan segmen atau manajemen memori. Tujuan utamanya adalah untuk meningkatkan kinerja dan terkadang untuk men-debug masalah. Dokumentasi, terutama di bawah bagian &quot;Konsep&quot; dan &quot;Panduan Administrasi&quot; sangat membantu di sini, sebagai contoh lihat halaman <a href="https://milvus.io/docs/architecture_overview.md">&quot;Gambaran Umum Arsitektur Milvus&quot;</a> dan <a href="https://milvus.io/docs/clustering-compaction.md">&quot;Pemadatan Clustering&quot;</a>. Kami akan terus meningkatkan dokumentasi internal Milvus, membuatnya lebih mudah dipahami, dan menerima umpan balik atau permintaan apa pun melalui <a href="https://milvus.io/discord">Discord</a>.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">Model embedding mana yang harus saya pilih?</h3><p>Sebuah pertanyaan yang berkaitan dengan kinerja yang telah muncul beberapa kali dalam pertemuan, jam kerja, dan di Discord adalah bagaimana memilih model embedding. Ini adalah pertanyaan yang sulit untuk memberikan jawaban yang pasti meskipun kami merekomendasikan untuk memulai dengan model default seperti <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>.</p>
<p>Sama halnya dengan pilihan indeks pencarian, ada tradeoff antara komputasi, penyimpanan, dan pemanggilan. Model penyematan dengan dimensi keluaran yang lebih besar akan membutuhkan lebih banyak penyimpanan, semua hal lain dianggap sama, meskipun mungkin menghasilkan penarikan kembali yang lebih tinggi dari item yang relevan. Model penyematan yang lebih besar, untuk dimensi yang tetap, biasanya mengungguli model yang lebih kecil dalam hal penarikan kembali, meskipun dengan biaya komputasi dan waktu yang lebih tinggi. Papan peringkat yang memberi peringkat kinerja model embedding seperti <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a> didasarkan pada tolok ukur yang mungkin tidak sesuai dengan data dan tugas spesifik Anda.</p>
<p>Jadi, tidak masuk akal untuk memikirkan model penyematan yang "terbaik". Mulailah dengan model yang memiliki daya ingat yang dapat diterima dan memenuhi anggaran komputasi dan waktu Anda untuk menghitung penyematan. Pengoptimalan lebih lanjut seperti menyempurnakan data Anda atau mengeksplorasi komputasi/pemanggilan kembali secara empiris dapat ditunda setelah Anda memiliki sistem yang berfungsi dalam produksi.</p>
<h2 id="Data-Management" class="common-anchor-header">Manajemen Data<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cara memindahkan data ke dalam dan keluar dari penerapan Milvus adalah tema utama lain dalam diskusi Discord, yang tidak mengherankan mengingat betapa pentingnya tugas ini untuk menempatkan aplikasi ke dalam produksi.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">Bagaimana cara memindahkan data dari X ke Milvus? Bagaimana cara memigrasikan data dari Standalone ke Distributed? Bagaimana cara memigrasi dari 2.4.x ke 2.5.x?</h3><p>Pengguna baru biasanya ingin memasukkan data yang sudah ada ke dalam Milvus dari platform lain, termasuk mesin pencari tradisional seperti <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a> dan basis data vektor lainnya seperti <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> atau <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>. Pengguna yang sudah ada mungkin juga ingin memigrasikan data mereka dari satu penerapan Milvus ke yang lain, atau <a href="https://docs.zilliz.com/docs/migrate-from-milvus">dari Milvus yang dihosting sendiri ke Zilliz Cloud yang dikelola sepenuhnya</a>.</p>
<p><a href="https://github.com/zilliztech/vts">Layanan Vector Transport Service (VTS</a> ) dan layanan <a href="https://docs.zilliz.com/docs/migrations">Migrasi</a> terkelola di Zilliz Cloud dirancang untuk tujuan ini.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">Bagaimana cara menyimpan dan memuat cadangan data? Bagaimana cara mengekspor data dari Milvus?</h3><p>Milvus memiliki alat khusus, <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>, untuk mengambil snapshot pada penyimpanan permanen dan memulihkannya.</p>
<h2 id="Next-Steps" class="common-anchor-header">Langkah selanjutnya<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>Saya harap ini telah memberi Anda beberapa petunjuk tentang cara mengatasi tantangan umum yang dihadapi ketika membangun dengan database vektor. Hal ini tentunya membantu kami untuk melihat kembali dokumentasi dan peta jalan fitur kami untuk terus mengerjakan hal-hal yang dapat membantu komunitas kami agar dapat sukses dengan Milvus. Satu hal penting yang ingin saya tekankan adalah bahwa pilihan Anda menempatkan Anda pada titik-titik yang berbeda dalam ruang tradeoff antara komputasi, penyimpanan, latensi, dan pemanggilan. <em>Anda tidak dapat memaksimalkan semua kriteria kinerja ini secara bersamaan - tidak ada penerapan yang "optimal". Namun, dengan memahami lebih lanjut tentang cara kerja pencarian vektor dan sistem basis data terdistribusi, Anda dapat membuat keputusan yang tepat.</em></p>
<p>Setelah menelusuri sejumlah besar postingan dari tahun 2024, saya berpikir: mengapa manusia harus melakukan ini? Bukankah AI Generatif telah berjanji untuk menyelesaikan tugas seperti itu, yaitu mengurai teks dalam jumlah besar dan mengekstraksi wawasan? Bergabunglah dengan saya di bagian kedua dari artikel blog ini (segera hadir), di mana saya menyelidiki desain dan implementasi <em>sistem multi-agen untuk mengekstraksi wawasan dari forum diskusi</em>.</p>
<p>Sekali lagi terima kasih dan semoga kita bisa bertemu di komunitas <a href="https://milvus.io/discord">Discord</a> dan pertemuan <a href="https://lu.ma/unstructured-data-meetup">Unstructured Data</a> berikutnya. Untuk bantuan yang lebih praktis, kami mempersilakan Anda untuk memesan <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">jam kerja 1-on-1.</a> <em>Masukan Anda sangat penting untuk meningkatkan Milvus!</em></p>
