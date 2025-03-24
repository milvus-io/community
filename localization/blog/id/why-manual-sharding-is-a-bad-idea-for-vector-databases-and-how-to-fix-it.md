---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: >-
  Mengapa Sharding Manual adalah Ide yang Buruk untuk Basis Data Vektor dan
  Bagaimana Cara Mengatasinya
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  Temukan mengapa sharding database vektor manual menciptakan kemacetan dan
  bagaimana penskalaan otomatis Milvus menghilangkan biaya teknik untuk
  pertumbuhan yang mulus.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_300b84a4d9.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p><em>"Awalnya kami membangun pencarian semantik kami di pgvector, bukan Milvus, karena semua data relasional kami sudah ada di PostgreSQL,"</em> kenang Alex, CTO sebuah startup SaaS AI perusahaan. <em>"Namun segera setelah kami mencapai kesesuaian produk-pasar, pertumbuhan kami mengalami rintangan serius di sisi teknik. Dengan cepat menjadi jelas bahwa pgvector tidak dirancang untuk skalabilitas. Tugas-tugas sederhana seperti meluncurkan pembaruan skema di beberapa pecahan berubah menjadi proses yang membosankan dan rawan kesalahan yang menghabiskan waktu berhari-hari dalam upaya rekayasa. Ketika kami mencapai 100 juta penyematan vektor, latensi kueri melonjak menjadi lebih dari satu detik, sesuatu yang jauh melampaui batas yang dapat ditoleransi oleh pelanggan kami. Setelah pindah ke Milvus, melakukan sharding secara manual terasa seperti masuk ke zaman batu. Tidaklah menyenangkan menyulap server pecahan seolah-olah mereka adalah artefak yang rapuh. Tidak ada perusahaan yang harus menanggungnya."</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">Tantangan Umum bagi Perusahaan AI<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengalaman Alex tidak hanya dialami oleh pengguna pgvector. Apakah Anda menggunakan pgvector, Qdrant, Weaviate, atau basis data vektor lainnya yang bergantung pada pemecahan manual, tantangan penskalaan tetap sama. Apa yang dimulai sebagai solusi yang mudah dikelola dengan cepat berubah menjadi utang teknologi seiring dengan bertambahnya volume data.</p>
<p>Bagi perusahaan rintisan saat ini, <strong>skalabilitas bukanlah pilihan, melainkan sangat penting</strong>. Hal ini terutama berlaku untuk produk AI yang didukung oleh Large Language Models (LLM) dan basis data vektor, di mana lompatan dari adopsi awal ke pertumbuhan eksponensial dapat terjadi dalam semalam. Mencapai kesesuaian produk dengan pasar sering kali memicu lonjakan pertumbuhan pengguna, arus masuk data yang luar biasa, dan permintaan kueri yang meroket. Namun jika infrastruktur database tidak dapat mengimbanginya, permintaan yang lambat dan inefisiensi operasional dapat menghambat momentum dan menghalangi kesuksesan bisnis.</p>
<p>Keputusan teknis jangka pendek dapat menyebabkan kemacetan jangka panjang, memaksa tim teknisi untuk terus-menerus mengatasi masalah kinerja yang mendesak, kerusakan basis data, dan kegagalan sistem alih-alih berfokus pada inovasi. Skenario terburuk? Arsitektur ulang basis data yang mahal dan memakan waktu - justru ketika perusahaan harus melakukan penskalaan.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">Bukankah Sharding adalah Solusi Alami untuk Skalabilitas?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Skalabilitas dapat diatasi dengan berbagai cara. Pendekatan yang paling mudah, <strong>Scaling Up</strong>, melibatkan peningkatan sumber daya mesin tunggal dengan menambahkan lebih banyak CPU, memori, atau penyimpanan untuk mengakomodasi volume data yang terus bertambah. Meskipun sederhana, metode ini memiliki keterbatasan yang jelas. Dalam lingkungan Kubernetes, misalnya, pod yang besar tidak efisien, dan mengandalkan satu node akan meningkatkan risiko kegagalan, sehingga berpotensi menyebabkan waktu henti yang signifikan.</p>
<p>Ketika Scaling Up tidak lagi dapat dilakukan, bisnis secara alami beralih ke <strong>Scaling Out</strong>, mendistribusikan data ke beberapa server. Sekilas, <strong>sharding</strong> tampak sebagai solusi sederhana - membagi database menjadi database yang lebih kecil dan independen untuk meningkatkan kapasitas dan memungkinkan beberapa node utama yang dapat ditulis.</p>
<p>Namun, meskipun secara konseptual mudah, sharding dengan cepat menjadi tantangan yang kompleks dalam praktiknya. Sebagian besar aplikasi pada awalnya dirancang untuk bekerja dengan satu database terpadu. Saat database vektor dibagi menjadi beberapa pecahan, setiap bagian dari aplikasi yang berinteraksi dengan data harus dimodifikasi atau ditulis ulang secara keseluruhan, sehingga menimbulkan biaya pengembangan yang signifikan. Merancang strategi sharding yang efektif menjadi sangat penting, seperti halnya menerapkan logika perutean untuk memastikan data diarahkan ke shard yang benar. Mengelola transaksi atomik di beberapa pecahan sering kali membutuhkan restrukturisasi aplikasi untuk menghindari operasi lintas pecahan. Selain itu, skenario kegagalan harus ditangani dengan baik untuk mencegah gangguan saat pecahan tertentu tidak tersedia.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">Mengapa Pecahan Manual Menjadi Beban<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p><em>&quot;Awalnya kami memperkirakan penerapan sharding manual untuk database pgvector kami akan memakan waktu sekitar enam bulan bagi dua teknisi,&quot;</em> kenang Alex. <em>&quot;Yang tidak kami sadari adalah teknisi tersebut akan</em> <strong><em>selalu</em></strong> <em>dibutuhkan. Setiap perubahan skema, operasi penyeimbangan ulang data, atau keputusan penskalaan membutuhkan keahlian khusus mereka. Pada dasarnya kami berkomitmen pada 'tim sharding' permanen hanya untuk menjaga database kami tetap berjalan.&quot;</em></p>
<p>Tantangan dunia nyata dengan database vektor yang dipecah-pecah meliputi:</p>
<ol>
<li><p><strong>Ketidakseimbangan Distribusi Data (Hotspot)</strong>: Dalam kasus penggunaan multi-penyewa, distribusi data dapat berkisar dari ratusan hingga miliaran vektor per penyewa. Ketidakseimbangan ini menciptakan titik-titik panas di mana pecahan tertentu menjadi kelebihan beban sementara yang lain menganggur.</p></li>
<li><p><strong>Sakit kepala saat melakukan resharding</strong>: Memilih jumlah pecahan yang tepat hampir tidak mungkin. Jumlah yang terlalu sedikit akan menyebabkan operasi resharding yang sering dan mahal. Terlalu banyak akan menimbulkan overhead metadata yang tidak perlu, meningkatkan kompleksitas dan mengurangi kinerja.</p></li>
<li><p><strong>Kompleksitas Perubahan Skema</strong>: Banyak basis data vektor mengimplementasikan sharding dengan mengelola beberapa basis data yang mendasarinya. Hal ini membuat sinkronisasi perubahan skema di seluruh pecahan menjadi tidak praktis dan rentan terhadap kesalahan, sehingga memperlambat siklus pengembangan.</p></li>
<li><p><strong>Pemborosan Sumber Daya</strong>: Dalam database yang digabungkan dengan penyimpanan-komputasi, Anda harus mengalokasikan sumber daya dengan cermat di setiap node sambil mengantisipasi pertumbuhan di masa depan. Biasanya, ketika pemanfaatan sumber daya mencapai 60-70%, Anda harus mulai merencanakan untuk melakukan hardening.</p></li>
</ol>
<p>Sederhananya, <strong>mengelola pecahan secara manual tidak baik untuk bisnis Anda</strong>. Daripada mengunci tim teknisi Anda ke dalam manajemen pecahan yang konstan, pertimbangkan untuk berinvestasi dalam basis data vektor yang dirancang untuk menskalakan secara otomatis-tanpa beban operasional.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Bagaimana Milvus Memecahkan Masalah Skalabilitas<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak pengembang - dari startup hingga perusahaan - telah menyadari biaya tambahan yang signifikan terkait dengan pecahan basis data manual. Milvus mengambil pendekatan yang berbeda secara fundamental, memungkinkan penskalaan yang mulus dari jutaan hingga miliaran vektor tanpa kerumitan.</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">Penskalaan Otomatis Tanpa Hutang Teknologi</h3><p>Milvus memanfaatkan Kubernetes dan arsitektur komputasi-penyimpanan yang terpilah untuk mendukung ekspansi tanpa batas. Desain ini memungkinkan:</p>
<ul>
<li><p>Penskalaan yang cepat dalam menanggapi perubahan permintaan</p></li>
<li><p>Penyeimbangan beban otomatis di semua node yang tersedia</p></li>
<li><p>Alokasi sumber daya independen, memungkinkan Anda menyesuaikan komputasi, memori, dan penyimpanan secara terpisah</p></li>
<li><p>Performa tinggi yang konsisten, bahkan selama periode pertumbuhan yang cepat</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">Arsitektur Terdistribusi yang Dirancang dari Bawah ke Atas</h3><p>Milvus mencapai kemampuan penskalaannya melalui dua inovasi utama:</p>
<p><strong>Arsitektur Berbasis Segmen:</strong> Pada intinya, Milvus mengatur data ke dalam &quot;segmen&quot; - unit terkecil dalam manajemen data:</p>
<ul>
<li><p>Segmen yang Berkembang berada di StreamNodes, mengoptimalkan kesegaran data untuk kueri waktu nyata</p></li>
<li><p>Segmen Tertutup dikelola oleh QueryNodes, memanfaatkan indeks yang kuat untuk mempercepat pencarian</p></li>
<li><p>Segmen-segmen ini didistribusikan secara merata di seluruh node untuk mengoptimalkan pemrosesan paralel</p></li>
</ul>
<p><strong>Perutean Dua Lapisan</strong>: Tidak seperti database tradisional di mana setiap pecahan berada di satu mesin, Milvus mendistribusikan data dalam satu pecahan secara dinamis di beberapa node:</p>
<ul>
<li><p>Setiap pecahan dapat menyimpan lebih dari 1 miliar titik data</p></li>
<li><p>Segmen dalam setiap pecahan secara otomatis diseimbangkan di seluruh mesin</p></li>
<li><p>Memperluas koleksi semudah menambah jumlah pecahan</p></li>
<li><p>Milvus 3.0 yang akan datang akan memperkenalkan pemisahan pecahan dinamis, bahkan menghilangkan langkah manual yang minimal ini</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">Pemrosesan Kueri dalam Skala Besar</h3><p>Ketika mengeksekusi sebuah kueri, Milvus mengikuti sebuah proses yang efisien:</p>
<ol>
<li><p>Proxy mengidentifikasi pecahan yang relevan untuk koleksi yang diminta</p></li>
<li><p>Proxy mengumpulkan data dari StreamNodes dan QueryNodes</p></li>
<li><p>StreamNodes menangani data waktu nyata sementara QueryNodes memproses data historis secara bersamaan</p></li>
<li><p>Hasil dikumpulkan dan dikembalikan ke pengguna</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">Pengalaman Rekayasa yang Berbeda<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><em>"Ketika skalabilitas dibangun ke dalam database itu sendiri, semua sakit kepala itu hilang begitu saja,"</em> kata Alex, merefleksikan transisi timnya ke Milvus. <em>"Teknisi saya kembali membangun fitur-fitur yang disukai pelanggan alih-alih mengurusi pecahan-pecahan basis data."</em></p>
<p>Jika Anda bergulat dengan beban teknis sharding manual, hambatan kinerja dalam skala besar, atau prospek migrasi basis data yang menakutkan, inilah saatnya untuk memikirkan kembali pendekatan Anda. Kunjungi <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">halaman dokumen</a> kami untuk mempelajari lebih lanjut tentang arsitektur Milvus, atau rasakan skalabilitas yang mudah secara langsung dengan Milvus yang dikelola secara penuh di <a href="https://zilliz.com/cloud">zilliz.com/cloud</a>.</p>
<p>Dengan fondasi basis data vektor yang tepat, inovasi Anda tidak mengenal batas.</p>
