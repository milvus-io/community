---
id: what-milvus-version-to-start-with.md
title: Versi Milvus apa yang digunakan untuk memulai
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: >-
  Panduan komprehensif tentang fitur dan kemampuan setiap versi Milvus untuk
  membuat keputusan yang tepat untuk proyek pencarian vektor Anda.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Pengenalan versi Milvus</custom-h1><p>Memilih versi Milvus yang tepat merupakan hal yang paling penting untuk keberhasilan proyek apa pun yang memanfaatkan teknologi pencarian vektor. Dengan berbagai versi Milvus yang disesuaikan dengan kebutuhan yang berbeda-beda, memahami pentingnya memilih versi yang tepat sangat penting untuk mencapai hasil yang diinginkan.</p>
<p>Versi Milvus yang tepat dapat membantu pengembang untuk belajar dan membuat prototipe dengan cepat atau membantu mengoptimalkan pemanfaatan sumber daya, merampingkan upaya pengembangan, dan memastikan kompatibilitas dengan infrastruktur dan alat yang ada. Pada akhirnya, ini adalah tentang menjaga produktivitas pengembang dan meningkatkan efisiensi, keandalan, dan kepuasan pengguna.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Versi Milvus yang tersedia<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Tiga versi Milvus tersedia untuk para pengembang, dan semuanya bersifat open source. Ketiga versi tersebut adalah Milvus Lite, Milvus Standalone, dan Milvus Cluster, yang memiliki perbedaan dalam hal fitur dan bagaimana pengguna berencana untuk menggunakan Milvus dalam jangka pendek dan jangka panjang. Jadi, mari kita jelajahi satu per satu.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti namanya, Milvus Lite adalah versi ringan yang terintegrasi dengan Google Colab dan Jupyter Notebook. Milvus Lite dikemas sebagai biner tunggal tanpa ketergantungan tambahan, membuatnya mudah untuk diinstal dan dijalankan di mesin Anda atau disematkan dalam aplikasi Python. Selain itu, Milvus Lite menyertakan server mandiri Milvus berbasis CLI, memberikan fleksibilitas untuk menjalankannya secara langsung pada mesin Anda. Apakah Anda menyematkannya dalam kode Python Anda atau menggunakannya sebagai server mandiri sepenuhnya tergantung pada preferensi Anda dan persyaratan aplikasi spesifik Anda.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Fitur dan Kemampuan</h3><p>Milvus Lite mencakup semua fitur pencarian vektor Milvus inti.</p>
<ul>
<li><p><strong>Kemampuan Pencarian</strong>: Mendukung pencarian top-k, rentang, dan hibrida, termasuk pemfilteran metadata, untuk memenuhi kebutuhan pencarian yang beragam.</p></li>
<li><p><strong>Jenis Indeks dan Metrik Kemiripan</strong>: Menawarkan dukungan untuk 11 jenis indeks dan lima metrik kemiripan, memberikan fleksibilitas dan opsi penyesuaian untuk kasus penggunaan spesifik Anda.</p></li>
<li><p><strong>Pemrosesan Data</strong>: Memungkinkan pemrosesan batch (Apache Parquet, Array, JSON) dan stream, dengan integrasi tanpa batas melalui konektor untuk Airbyte, Apache Kafka, dan Apache Spark.</p></li>
<li><p><strong>Operasi CRUD</strong>: Menawarkan dukungan CRUD penuh (buat, baca, perbarui/update, hapus), memberdayakan pengguna dengan kemampuan manajemen data yang komprehensif.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">Aplikasi dan keterbatasan</h3><p>Milvus Lite sangat ideal untuk pembuatan prototipe cepat dan pengembangan lokal, menawarkan dukungan untuk penyiapan cepat dan eksperimen dengan dataset skala kecil pada mesin Anda. Namun, keterbatasannya menjadi jelas ketika bertransisi ke lingkungan produksi dengan dataset yang lebih besar dan persyaratan infrastruktur yang lebih berat. Oleh karena itu, meskipun Milvus Lite adalah alat yang sangat baik untuk eksplorasi dan pengujian awal, alat ini mungkin tidak cocok untuk menerapkan aplikasi dalam pengaturan volume tinggi atau siap produksi.</p>
<h3 id="Available-Resources" class="common-anchor-header">Sumber Daya yang Tersedia</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">Dokumentasi</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Repositori Github</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Contoh Google Colab</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">Video Memulai</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus Mandiri<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus menawarkan dua mode operasional: Standalone dan Cluster. Kedua mode ini identik dalam fitur basis data vektor inti dan berbeda dalam hal dukungan ukuran data dan persyaratan skalabilitas. Perbedaan ini memungkinkan Anda untuk memilih mode yang paling sesuai dengan ukuran dataset, volume lalu lintas, dan persyaratan infrastruktur lainnya untuk produksi.</p>
<p>Milvus Standalone adalah mode operasi untuk sistem basis data vektor Milvus yang beroperasi secara independen sebagai contoh tunggal tanpa pengelompokan atau pengaturan terdistribusi. Milvus berjalan pada satu server atau mesin dalam mode ini, menyediakan fungsionalitas seperti pengindeksan dan pencarian vektor. Mode ini cocok untuk situasi di mana skala volume data dan lalu lintas relatif kecil dan tidak memerlukan kemampuan terdistribusi yang disediakan oleh pengaturan terkluster.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Fitur dan Kemampuan</h3><ul>
<li><p><strong>Performa Tinggi</strong>: Melakukan pencarian vektor pada kumpulan data yang sangat besar (miliaran atau lebih) dengan kecepatan dan efisiensi yang luar biasa.</p></li>
<li><p><strong>Kemampuan Pencarian</strong>: Mendukung pencarian top-k, rentang, dan hibrida, termasuk pemfilteran metadata, untuk memenuhi kebutuhan pencarian yang beragam.</p></li>
<li><p><strong>Jenis Indeks dan Metrik Kemiripan</strong>: Menawarkan dukungan untuk 11 jenis indeks dan 5 metrik kemiripan, memberikan fleksibilitas dan opsi penyesuaian untuk kasus penggunaan spesifik Anda.</p></li>
<li><p><strong>Pemrosesan Data</strong>: Memungkinkan pemrosesan batch (Apache Parket, Larik, Json) dan streaming, dengan integrasi tanpa batas melalui konektor untuk Airbyte, Apache Kafka, dan Apache Spark.</p></li>
<li><p><strong>Replikasi dan Failover Data</strong>: Fitur replikasi dan failover/failback bawaan memastikan integritas data dan ketersediaan aplikasi, bahkan selama gangguan atau kegagalan.</p></li>
<li><p><strong>Skalabilitas</strong>: Dapatkan skalabilitas dinamis dengan penskalaan tingkat komponen, memungkinkan penskalaan naik dan turun tanpa hambatan berdasarkan permintaan. Milvus dapat melakukan penskalaan otomatis pada tingkat komponen, mengoptimalkan alokasi sumber daya untuk meningkatkan efisiensi.</p></li>
<li><p><strong>Multi-Tenancy</strong>: Mendukung multi-tenancy dengan kemampuan untuk mengelola hingga 10.000 koleksi/partisi dalam sebuah cluster, memberikan pemanfaatan sumber daya yang efisien dan isolasi untuk pengguna atau aplikasi yang berbeda.</p></li>
<li><p><strong>Operasi CRUD</strong>: Menawarkan dukungan CRUD penuh (buat, baca, perbarui/update, hapus), memberdayakan pengguna dengan kemampuan manajemen data yang komprehensif.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Komponen penting:</h3><ul>
<li><p>Milvus: Komponen fungsional inti.</p></li>
<li><p>etcd: Mesin metadata yang bertanggung jawab untuk mengakses dan menyimpan metadata dari komponen internal Milvus, termasuk proksi, simpul indeks, dan banyak lagi.</p></li>
<li><p>MinIO: Mesin penyimpanan yang bertanggung jawab atas persistensi data dalam Milvus.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 1: Arsitektur Mandiri Milvus</p>
<h3 id="Available-Resources" class="common-anchor-header">Sumber Daya yang Tersedia</h3><ul>
<li><p>Dokumentasi</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Daftar Periksa Lingkungan untuk Milvus dengan Docker Compose</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Menginstal Milvus Standalone dengan Docker</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repositori Github</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus Cluster<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster adalah mode operasi untuk sistem basis data vektor Milvus di mana ia beroperasi dan didistribusikan di beberapa node atau server. Dalam mode ini, instance Milvus dikelompokkan bersama untuk membentuk sistem terpadu yang dapat menangani volume data yang lebih besar dan beban lalu lintas yang lebih tinggi dibandingkan dengan pengaturan mandiri. Milvus Cluster menawarkan skalabilitas, toleransi kesalahan, dan fitur penyeimbangan beban, sehingga cocok untuk skenario yang perlu menangani data besar dan melayani banyak kueri bersamaan secara efisien.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Fitur dan Kemampuan</h3><ul>
<li><p>Mewarisi semua fitur yang tersedia di Milvus Standalone, termasuk pencarian vektor berkinerja tinggi, dukungan untuk berbagai jenis indeks dan metrik kemiripan, serta integrasi tanpa batas dengan kerangka kerja pemrosesan batch dan stream.</p></li>
<li><p>Menawarkan ketersediaan, kinerja, dan pengoptimalan biaya yang tak tertandingi dengan memanfaatkan komputasi terdistribusi dan penyeimbangan beban di beberapa node.</p></li>
<li><p>Memungkinkan penerapan dan penskalaan beban kerja tingkat perusahaan yang aman dengan total biaya yang lebih rendah dengan memanfaatkan sumber daya secara efisien di seluruh cluster dan mengoptimalkan alokasi sumber daya berdasarkan permintaan beban kerja.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Komponen penting:</h3><p>Milvus Cluster mencakup delapan komponen layanan mikro dan tiga ketergantungan pihak ketiga. Semua layanan mikro dapat digunakan di Kubernetes secara independen satu sama lain.</p>
<h4 id="Microservice-components" class="common-anchor-header">Komponen layanan mikro</h4><ul>
<li><p>Koordinator akar (root coord)</p></li>
<li><p>Proxy</p></li>
<li><p>Koordinat kueri</p></li>
<li><p>Simpul kueri</p></li>
<li><p>Koordinat indeks</p></li>
<li><p>Simpul indeks</p></li>
<li><p>Koordinat data</p></li>
<li><p>Simpul data</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">Ketergantungan pihak ketiga</h4><ul>
<li><p>dll: Menyimpan metadata untuk berbagai komponen dalam cluster.</p></li>
<li><p>MinIO: Bertanggung jawab atas persistensi data dari file-file besar dalam cluster, seperti file indeks dan log biner.</p></li>
<li><p>Pulsar: Mengelola log dari operasi mutasi terbaru, mengeluarkan log streaming, dan menyediakan layanan berlangganan-publikasi log.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 2: Arsitektur Cluster Milvus</p>
<h4 id="Available-Resources" class="common-anchor-header">Sumber Daya yang Tersedia</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Dokumentasi</a> | Cara memulai</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Instal Milvus Cluster dengan Milvus Operator</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">Menginstal Milvus Cluster dengan Helm</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Cara menskalakan Milvus Cluster</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repositori Github</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Membuat Keputusan tentang versi Milvus mana yang akan digunakan<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika memutuskan versi Milvus mana yang akan digunakan untuk proyek Anda, Anda harus mempertimbangkan faktor-faktor seperti ukuran dataset, volume lalu lintas, persyaratan skalabilitas, dan batasan lingkungan produksi. Milvus Lite sangat cocok untuk membuat prototipe di laptop Anda. Milvus Standalone menawarkan kinerja dan fleksibilitas tinggi untuk melakukan pencarian vektor pada dataset Anda, sehingga cocok untuk penerapan skala yang lebih kecil, CI/CD, dan penerapan offline ketika Anda tidak memiliki dukungan Kubernetes... Dan terakhir, Milvus Cluster memberikan ketersediaan, skalabilitas, dan pengoptimalan biaya yang tak tertandingi untuk beban kerja tingkat perusahaan, menjadikannya pilihan yang lebih disukai untuk lingkungan produksi berskala besar dan sangat tersedia.</p>
<p>Ada versi lain yang merupakan versi tanpa kerumitan, yaitu versi terkelola Milvus yang disebut <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>.</p>
<p>Pada akhirnya, versi Milvus akan bergantung pada kasus penggunaan spesifik Anda, persyaratan infrastruktur, dan tujuan jangka panjang. Dengan mengevaluasi faktor-faktor ini dengan cermat dan memahami fitur dan kemampuan masing-masing versi, Anda dapat membuat keputusan yang tepat yang sesuai dengan kebutuhan dan tujuan proyek Anda. Baik Anda memilih Milvus Standalone atau Milvus Cluster, Anda dapat memanfaatkan kekuatan basis data vektor untuk meningkatkan kinerja dan efisiensi aplikasi AI Anda.</p>
