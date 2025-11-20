---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >-
  Mengungkap Performa 8× Milvus dengan Cloudian HyperStore dan NVIDIA RDMA untuk
  Penyimpanan S3
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_931ffc8646.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  Cloudian dan NVIDIA memperkenalkan RDMA untuk penyimpanan yang kompatibel
  dengan S3, mempercepat beban kerja AI dengan latensi rendah dan memungkinkan
  peningkatan kinerja 8× lipat di Milvus.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>Artikel ini awalnya dipublikasikan di <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a> dan diposting ulang di sini dengan izin.</em></p>
<p>Cloudian telah berkolaborasi dengan NVIDIA untuk menambahkan dukungan RDMA untuk penyimpanan yang kompatibel dengan S3 pada solusi HyperStore®, dengan memanfaatkan pengalaman lebih dari 13 tahun dalam implementasi S3 API. Sebagai platform berbasis S3-API dengan arsitektur pemrosesan paralel, Cloudian memiliki keunikan tersendiri untuk berkontribusi dan memanfaatkan perkembangan teknologi ini. Kolaborasi ini memanfaatkan keahlian Cloudian yang mendalam dalam protokol penyimpanan objek dan kepemimpinan NVIDIA dalam hal akselerasi komputasi dan jaringan untuk menciptakan solusi yang mengintegrasikan komputasi berkinerja tinggi dengan penyimpanan berskala perusahaan secara mulus.</p>
<p>NVIDIA telah mengumumkan ketersediaan RDMA yang akan datang untuk teknologi penyimpanan yang kompatibel dengan S3 (Remote Direct Memory Access), yang menandai tonggak penting dalam evolusi infrastruktur AI. Teknologi terobosan ini menjanjikan untuk mengubah cara organisasi menangani kebutuhan data yang sangat besar dari beban kerja AI modern, memberikan peningkatan kinerja yang belum pernah terjadi sebelumnya dengan tetap mempertahankan skalabilitas dan kesederhanaan yang menjadikan penyimpanan objek yang kompatibel dengan S3 sebagai fondasi komputasi awan.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">Apa itu RDMA untuk penyimpanan yang kompatibel dengan S3?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>Peluncuran ini merupakan kemajuan mendasar dalam cara sistem penyimpanan berkomunikasi dengan akselerator AI. Teknologi ini memungkinkan transfer data langsung antara penyimpanan objek yang kompatibel dengan S3 API dan memori GPU, sepenuhnya melewati jalur data yang dimediasi oleh CPU. Tidak seperti arsitektur penyimpanan konvensional yang merutekan semua transfer data melalui CPU dan memori sistem-yang menyebabkan kemacetan dan latensi-RDMA untuk penyimpanan yang kompatibel dengan S3 membangun jalan raya langsung dari penyimpanan ke GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pada intinya, teknologi ini menghilangkan langkah perantara dengan jalur langsung yang mengurangi latensi, secara dramatis memangkas kebutuhan pemrosesan CPU, dan secara signifikan mengurangi konsumsi daya. Hasilnya adalah sistem penyimpanan yang dapat mengirimkan data dengan kecepatan yang dibutuhkan GPU modern untuk aplikasi AI yang menuntut.</p>
<p>Teknologi ini mempertahankan kompatibilitas dengan API S3 yang ada di mana-mana sembari menambahkan jalur data berkinerja tinggi ini. Perintah masih dikeluarkan melalui protokol penyimpanan berbasis S3-API standar, tetapi transfer data yang sebenarnya terjadi melalui RDMA langsung ke memori GPU, melewati CPU sepenuhnya dan menghilangkan overhead pemrosesan protokol TCP.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">Hasil Kinerja Terobosan<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Peningkatan performa yang diberikan oleh RDMA untuk penyimpanan yang kompatibel dengan S3 sungguh luar biasa. Pengujian di dunia nyata menunjukkan kemampuan teknologi ini untuk menghilangkan hambatan I/O penyimpanan yang membatasi beban kerja AI.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">Peningkatan Kecepatan yang Dramatis:</h3><ul>
<li><p><strong>35 GB/s per throughput node</strong> (pembacaan) yang diukur, dengan skalabilitas linier di seluruh cluster</p></li>
<li><p><strong>Skalabilitas hingga TB/s</strong> dengan arsitektur pemrosesan paralel Cloudian</p></li>
<li><p><strong>Peningkatan throughput 3-5x</strong> lipat dibandingkan dengan penyimpanan objek berbasis TCP konvensional</p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">Keuntungan Efisiensi Sumber Daya:</h3><ul>
<li><p><strong>Pengurangan 90% dalam pemanfaatan CPU</strong> dengan membuat jalur data langsung ke GPU</p></li>
<li><p><strong>Meningkatkan pemanfaatan GPU</strong> dengan menghilangkan kemacetan</p></li>
<li><p>Pengurangan dramatis dalam konsumsi daya melalui pengurangan overhead pemrosesan</p></li>
<li><p>Pengurangan biaya untuk penyimpanan AI</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">Peningkatan Performa 8X pada Milvus oleh Zilliz Vector DB</h3><p>Peningkatan kinerja ini sangat jelas terlihat dalam operasi database vektor, di mana kolaborasi antara Cloudian dan Zilliz menggunakan <a href="https://www.nvidia.com/en-us/data-center/l40s/">GPU</a> <a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a> dan <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S</a> menunjukkan <strong>peningkatan kinerja 8x lipat dalam operasi Milvus</strong> jika dibandingkan dengan sistem berbasis CPU dan transfer data berbasis TCP. Hal ini menunjukkan pergeseran mendasar dari penyimpanan yang menjadi kendala menjadi penyimpanan yang memungkinkan aplikasi AI mencapai potensi penuhnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">Mengapa Penyimpanan Objek berbasis API S3 untuk Beban Kerja AI<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>Konvergensi teknologi RDMA dengan arsitektur penyimpanan objek menciptakan fondasi yang ideal untuk infrastruktur AI, mengatasi berbagai tantangan yang selama ini membatasi pendekatan penyimpanan tradisional.</p>
<p><strong>Skalabilitas Exabyte untuk Ledakan Data AI:</strong> Beban kerja AI, terutama yang melibatkan data sintetis dan multi-modal, mendorong kebutuhan penyimpanan ke dalam kisaran 100 petabyte dan seterusnya. Ruang alamat datar penyimpanan objek berskala mulus dari petabyte hingga exabyte, mengakomodasi pertumbuhan eksponensial dalam kumpulan data pelatihan AI tanpa batasan hierarki yang membatasi sistem berbasis file.</p>
<p><strong>Platform Terpadu untuk Alur Kerja AI yang Lengkap:</strong> Operasi AI modern mencakup pemasukan data, pembersihan, pelatihan, pemeriksaan, dan kesimpulan - masing-masing dengan persyaratan kinerja dan kapasitas yang berbeda. Penyimpanan objek yang kompatibel dengan S3 mendukung seluruh spektrum ini melalui akses API yang konsisten, sehingga menghilangkan kerumitan dan biaya untuk mengelola berbagai tingkatan penyimpanan. Data pelatihan, model, file pos pemeriksaan, dan kumpulan data inferensi semuanya dapat berada dalam satu data lake berkinerja tinggi.</p>
<p><strong>Metadata yang Kaya untuk Operasi AI:</strong> Operasi AI yang penting seperti pencarian dan pencacahan pada dasarnya digerakkan oleh metadata. Kemampuan metadata yang kaya dan dapat disesuaikan dari penyimpanan objek memungkinkan penandaan, pencarian, dan manajemen data yang efisien - penting untuk mengatur dan mengambil data dalam pelatihan model AI yang kompleks dan alur kerja kesimpulan.</p>
<p><strong>Keuntungan Ekonomi dan Operasional:</strong> Penyimpanan objek yang kompatibel dengan S3 memberikan total biaya kepemilikan yang lebih rendah hingga 80% dibandingkan dengan alternatif penyimpanan file, dengan memanfaatkan perangkat keras standar industri dan penskalaan kapasitas dan kinerja yang independen. Efisiensi ekonomi ini menjadi sangat penting ketika dataset AI mencapai skala perusahaan.</p>
<p><strong>Keamanan dan Tata Kelola Perusahaan:</strong> Tidak seperti implementasi GPUDirect yang membutuhkan modifikasi tingkat kernel, RDMA untuk penyimpanan yang kompatibel dengan S3 tidak memerlukan perubahan kernel khusus vendor, sehingga menjaga keamanan sistem dan kepatuhan terhadap peraturan. Pendekatan ini sangat berharga di sektor-sektor seperti perawatan kesehatan dan keuangan di mana keamanan data dan kepatuhan terhadap peraturan sangat penting.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">Jalan di Depan<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengumuman RDMA untuk ketersediaan umum penyimpanan yang kompatibel dengan S3 dari NVIDIA merupakan lebih dari sekadar tonggak teknologi, tetapi juga menandakan pematangan arsitektur infrastruktur AI. Dengan menggabungkan skalabilitas penyimpanan objek yang tak terbatas dengan terobosan kinerja akses GPU langsung, organisasi akhirnya dapat membangun infrastruktur AI yang sesuai dengan ambisi mereka.</p>
<p>Karena beban kerja AI terus bertambah dalam hal kompleksitas dan skala, RDMA untuk penyimpanan yang kompatibel dengan S3 menyediakan fondasi penyimpanan yang memungkinkan organisasi untuk memaksimalkan investasi AI mereka dengan tetap mempertahankan kedaulatan data dan kesederhanaan operasional. Teknologi ini mengubah penyimpanan dari penghambat menjadi pendorong, sehingga memungkinkan aplikasi AI mencapai potensi penuhnya pada skala perusahaan.</p>
<p>Bagi organisasi yang merencanakan peta jalan infrastruktur AI mereka, ketersediaan RDMA untuk penyimpanan yang kompatibel dengan S3 secara umum menandai dimulainya era baru di mana kinerja penyimpanan benar-benar sesuai dengan tuntutan beban kerja AI modern.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">Perspektif Industri<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>Seiring dengan semakin pentingnya AI dalam penyediaan layanan kesehatan, kami terus berupaya meningkatkan kinerja dan efisiensi infrastruktur kami. RDMA baru untuk penyimpanan yang kompatibel dengan S3 dari NVIDIA dan Cloudian akan menjadi sangat penting untuk analisis pencitraan medis dan aplikasi AI diagnostik kami, di mana pemrosesan dataset yang besar dengan cepat dapat secara langsung berdampak pada perawatan pasien, sekaligus mengurangi biaya pemindahan data antara perangkat penyimpanan berbasis S3-API dan penyimpanan NAS berbasis SSD.  - <em>Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, Profesor FRCPath (F) Patologi, PI, AI/Komputasi Patologi Dan Laboratorium Pencitraan OIC- Departemen Onkologi Digital dan Komputasi, Tata Memorial Centre</em></p>
<p>"Pengumuman RDMA untuk S3 yang kompatibel dengan NVIDIA menegaskan nilai dari strategi infrastruktur AI berbasis Cloudian kami. Kami memungkinkan organisasi untuk menjalankan AI berkinerja tinggi dalam skala besar dengan tetap mempertahankan kompatibilitas API S3 yang membuat migrasi tetap sederhana dan biaya pengembangan aplikasi tetap rendah." - <em>Sunil Gupta, Co-founder, Managing Director &amp; Chief Executive Officer (CEO), Yotta Data Services</em></p>
<p>"Saat kami memperluas kemampuan on-premise kami untuk menghadirkan AI yang berdaulat, RDMA NVIDIA untuk teknologi penyimpanan yang kompatibel dengan S3 dan penyimpanan objek berkinerja tinggi dari Cloudian memberikan performa yang kami butuhkan tanpa mengorbankan penyimpanan data dan tanpa memerlukan modifikasi tingkat kernel. Platform Cloudian HyperStore memungkinkan kami meningkatkan skala hingga exabyte sekaligus menjaga data AI sensitif kami sepenuhnya di bawah kendali kami." - <em>Logan Lee, EVP &amp; Head of Cloud, Kakao</em></p>
<p>"Kami sangat antusias dengan pengumuman NVIDIA tentang rilis GA RDMA untuk penyimpanan yang kompatibel dengan S3 yang akan datang. Pengujian kami dengan Cloudian menunjukkan peningkatan performa hingga 8X lipat untuk operasi database vektor, yang akan memungkinkan pengguna Milvus by Zilliz mencapai performa skala cloud untuk beban kerja AI yang berat dengan tetap mempertahankan kedaulatan data yang lengkap." - <em>Charles Xie, Pendiri dan CEO Zilliz</em></p>
