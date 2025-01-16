---
id: deep-dive-8-knowhere.md
title: Apa yang Mendukung Pencarian Kemiripan di Basis Data Vektor Milvus?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'Dan tidak, itu bukan Faiss.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>gambar sampul</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/cydrain">Yudong Cai</a> dan diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Sebagai mesin eksekusi vektor inti, Knowhere untuk Milvus adalah seperti mesin untuk mobil sport. Artikel ini memperkenalkan apa itu Knowhere, apa bedanya dengan Faiss, dan bagaimana kode Knowhere disusun.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Konsep Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere dalam arsitektur Milvus</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere Vs Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Memahami kode Knowhere</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Menambahkan indeks ke Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Konsep Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Secara sempit, Knowhere adalah antarmuka operasi untuk mengakses layanan di lapisan atas sistem dan pustaka pencarian kemiripan vektor seperti <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy</a> di lapisan bawah sistem. Selain itu, Knowhere juga bertanggung jawab atas komputasi heterogen. Lebih khusus lagi, Knowhere mengontrol perangkat keras mana (mis. CPU atau GPU) yang akan mengeksekusi pembuatan indeks dan permintaan pencarian. Inilah bagaimana Knowhere mendapatkan namanya - mengetahui di mana harus menjalankan operasi. Lebih banyak jenis perangkat keras termasuk DPU dan TPU akan didukung dalam rilis mendatang.</p>
<p>Dalam pengertian yang lebih luas, Knowhere juga menggabungkan pustaka indeks pihak ketiga lainnya seperti Faiss. Oleh karena itu, secara keseluruhan, Knowhere diakui sebagai mesin komputasi vektor inti dalam basis data vektor Milvus.</p>
<p>Dari konsep Knowhere, kita dapat melihat bahwa Knowhere hanya memproses tugas-tugas komputasi data, sedangkan tugas-tugas seperti sharding, load balance, pemulihan bencana berada di luar cakupan kerja Knowhere.</p>
<p>Mulai dari Milvus 2.0.1, <a href="https://github.com/milvus-io/knowhere">Knowhere</a> (dalam arti yang lebih luas) menjadi independen dari proyek Milvus.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere dalam arsitektur Milvus<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>arsitektur knowhere</span> </span></p>
<p>Komputasi dalam Milvus terutama melibatkan operasi vektor dan skalar. Knowhere hanya menangani operasi-operasi pada vektor di Milvus. Gambar di atas mengilustrasikan arsitektur Knowhere di Milvus.</p>
<p>Lapisan paling bawah adalah perangkat keras sistem. Pustaka indeks pihak ketiga berada di atas perangkat keras. Kemudian Knowhere berinteraksi dengan simpul indeks dan simpul kueri di bagian atas melalui CGO.</p>
<p>Artikel ini membahas tentang Knowhere dalam arti yang lebih luas, seperti yang ditandai dalam bingkai biru pada ilustrasi arsitektur.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere Vs Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere tidak hanya memperluas fungsi Faiss tetapi juga mengoptimalkan kinerjanya. Secara lebih spesifik, Knowhere memiliki beberapa keunggulan sebagai berikut.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Dukungan untuk BitsetView</h3><p>Awalnya, bitset diperkenalkan di Milvus untuk tujuan &quot;penghapusan lunak&quot;. Vektor yang dihapus secara lunak masih ada dalam database tetapi tidak akan dihitung selama pencarian atau kueri kemiripan vektor. Setiap bit dalam bitset berhubungan dengan vektor yang diindeks. Jika sebuah vektor ditandai sebagai "1" dalam bitset, itu berarti vektor ini telah dihapus dan tidak akan dilibatkan selama pencarian vektor.</p>
<p>Parameter bitset ditambahkan ke semua API kueri indeks Faiss yang terbuka di Knowhere, termasuk indeks CPU dan GPU.</p>
<p>Pelajari lebih lanjut tentang <a href="https://milvus.io/blog/2022-2-14-bitset.md">bagaimana bitset memungkinkan keserbagunaan pencarian vektor.</a></p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Dukungan untuk lebih banyak metrik kemiripan untuk mengindeks vektor biner</h3><p>Selain <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a>, Knowhere juga mendukung <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstruktur</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substruktur</a>. Jaccard dan Tanimoto dapat digunakan untuk mengukur kemiripan antara dua set sampel sementara Superstruktur dan Substruktur dapat digunakan untuk mengukur kemiripan struktur kimia.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Dukungan untuk set instruksi AVX512</h3><p>Faiss sendiri mendukung beberapa set instruksi termasuk <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>, <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. Knowhere lebih lanjut memperluas set instruksi yang didukung dengan menambahkan <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a>, yang dapat <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">meningkatkan kinerja pembangunan indeks dan kueri sebesar 20% hingga 30%</a> dibandingkan dengan AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Pemilihan instruksi SIMD otomatis</h3><p>Knowhere dirancang untuk bekerja dengan baik pada spektrum prosesor CPU yang luas (baik di lokasi maupun platform cloud) dengan instruksi SIMD yang berbeda (misalnya, SIMD SSE, AVX, AVX2, dan AVX512). Jadi tantangannya adalah, dengan adanya satu perangkat lunak biner (misalnya, Milvus), bagaimana cara membuatnya secara otomatis memanggil instruksi SIMD yang sesuai pada prosesor CPU apa pun? Faiss tidak mendukung pemilihan instruksi SIMD secara otomatis dan pengguna harus menentukan flag SIMD secara manual (misalnya, "-msse4") selama kompilasi. Namun, Knowhere dibangun dengan melakukan refactoring pada basis kode Faiss. Fungsi-fungsi umum (misalnya, komputasi kesamaan) yang mengandalkan akselerasi SIMD telah diperhitungkan. Kemudian untuk setiap fungsi, empat versi (yaitu, SSE, AVX, AVX2, AVX512) diimplementasikan dan masing-masing dimasukkan ke dalam file sumber yang terpisah. Kemudian file sumber selanjutnya dikompilasi secara individual dengan bendera SIMD yang sesuai. Oleh karena itu, pada saat runtime, Knowhere dapat secara otomatis memilih instruksi SIMD yang paling sesuai berdasarkan flag CPU saat ini dan kemudian menghubungkan penunjuk fungsi yang tepat menggunakan pengait.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Optimalisasi kinerja lainnya</h3><p>Baca <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: Sistem Manajemen Data Vektor yang Dibangun Khusus</a> untuk mengetahui lebih lanjut tentang pengoptimalan kinerja Knowhere.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Memahami kode Knowhere<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti yang disebutkan di bagian pertama, Knowhere hanya menangani operasi pencarian vektor. Oleh karena itu, Knowhere hanya memproses bidang vektor dari sebuah entitas (saat ini, hanya satu bidang vektor untuk entitas dalam sebuah koleksi yang didukung). Pembuatan indeks dan pencarian kesamaan vektor juga ditargetkan pada bidang vektor dalam sebuah segmen. Untuk memiliki pemahaman yang lebih baik mengenai model data, baca blognya <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">di sini</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>bidang entitas</span> </span></p>
<h3 id="Index" class="common-anchor-header">Indeks</h3><p>Indeks adalah jenis struktur data yang terpisah dari data vektor asli. Pengindeksan membutuhkan empat langkah: membuat indeks, melatih data, menyisipkan data, dan membangun indeks.</p>
<p>Untuk beberapa aplikasi AI, pelatihan dataset merupakan proses terpisah dari pencarian vektor. Pada jenis aplikasi ini, data dari dataset dilatih terlebih dahulu dan kemudian dimasukkan ke dalam basis data vektor seperti Milvus untuk pencarian kemiripan. Dataset terbuka seperti sift1M dan sift1B menyediakan data untuk pelatihan dan pengujian. Namun, di Knowhere, data untuk pelatihan dan pencarian dicampur bersama. Dengan kata lain, Knowhere melatih semua data dalam sebuah segmen dan kemudian memasukkan semua data yang telah dilatih dan membangun indeks untuk mereka.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Struktur kode Knowhere</h3><p>DataObj adalah kelas dasar dari semua struktur data di Knowhere. <code translate="no">Size()</code> adalah satu-satunya metode virtual di DataObj. Kelas Index diwarisi dari DataObj dengan sebuah field bernama &quot;size_&quot;. Kelas Index juga memiliki dua metode virtual - <code translate="no">Serialize()</code> dan <code translate="no">Load()</code>. Kelas VecIndex yang diturunkan dari Index adalah kelas dasar virtual untuk semua indeks vektor. VecIndex menyediakan metode-metode termasuk <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code>, dan <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>kelas dasar</span> </span></p>
<p>Jenis indeks lainnya tercantum di sebelah kanan pada gambar di atas.</p>
<ul>
<li>Indeks Faiss memiliki dua sub kelas: FaissBaseIndex untuk semua indeks pada vektor titik float, dan FaissBaseBinaryIndex untuk semua indeks pada vektor biner.</li>
<li>GPUIndex adalah kelas dasar untuk semua indeks GPU Faiss.</li>
<li>OffsetBaseIndex adalah kelas dasar untuk semua indeks yang dikembangkan sendiri. Hanya ID vektor yang disimpan dalam file indeks. Hasilnya, ukuran file indeks untuk vektor 128 dimensi dapat dikurangi hingga 2 kali lipat. Kami merekomendasikan untuk mempertimbangkan vektor asli juga ketika menggunakan jenis indeks ini untuk pencarian kemiripan vektor.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>Secara teknis, <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> bukanlah sebuah indeks, melainkan digunakan untuk pencarian brute-force. Ketika vektor dimasukkan ke dalam basis data vektor, tidak ada pelatihan data dan pembuatan indeks yang diperlukan. Pencarian akan dilakukan secara langsung pada data vektor yang dimasukkan.</p>
<p>Namun, demi konsistensi kode, IDMAP juga mewarisi kelas VecIndex dengan semua antarmuka virtualnya. Penggunaan IDMAP sama dengan indeks-indeks lainnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>Indeks IVF (inverted file) adalah indeks yang paling sering digunakan. Kelas IVF diturunkan dari VecIndex dan FaissBaseIndex, dan selanjutnya diperluas ke IVFSQ dan IVFPQ. GPUIVF diturunkan dari GPUIndex dan IVF. Kemudian GPUIVF diperluas menjadi GPUIVFSQ dan GPUIVFPQ.</p>
<p>IVFSQHybrid adalah kelas untuk indeks hybrid yang dikembangkan sendiri yang dieksekusi oleh coarse quantize pada GPU. Dan pencarian di dalam bucket dieksekusi di CPU. Jenis indeks ini dapat mengurangi terjadinya penyalinan memori antara CPU dan GPU dengan memanfaatkan kekuatan komputasi GPU. IVFSQHybrid memiliki tingkat recall yang sama dengan GPUIVFSQ tetapi hadir dengan kinerja yang lebih baik.</p>
<p>Struktur kelas dasar untuk indeks biner relatif lebih sederhana. BinaryIDMAP dan BinaryIVF diturunkan dari FaissBaseBinaryIndex dan VecIndex.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>Indeks pihak ketiga</span> </span></p>
<p>Saat ini, hanya ada dua jenis indeks pihak ketiga yang didukung selain Faiss: indeks berbasis pohon Annoy, dan indeks berbasis grafik HNSW. Kedua indeks pihak ketiga yang umum dan sering digunakan ini berasal dari VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Menambahkan indeks ke Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda ingin menambahkan indeks baru ke Knowhere, Anda dapat merujuk ke indeks yang sudah ada terlebih dahulu:</p>
<ul>
<li>Untuk menambahkan indeks berbasis kuantisasi, lihat IVF_FLAT.</li>
<li>Untuk menambahkan indeks berbasis grafik, lihat HNSW.</li>
<li>Untuk menambahkan indeks berbasis pohon, lihat Annoy.</li>
</ul>
<p>Setelah merujuk ke indeks yang ada, Anda dapat mengikuti langkah-langkah di bawah ini untuk menambahkan indeks baru ke Knowhere.</p>
<ol>
<li>Tambahkan nama indeks baru di <code translate="no">IndexEnum</code>. Tipe data adalah string.</li>
<li>Tambahkan pemeriksaan validasi data pada indeks baru di file <code translate="no">ConfAdapter.cpp</code>. Pemeriksaan validasi terutama untuk memvalidasi parameter untuk pelatihan data dan kueri.</li>
<li>Buat file baru untuk indeks baru. Kelas dasar dari indeks baru harus menyertakan <code translate="no">VecIndex</code>, dan antarmuka virtual yang diperlukan dari <code translate="no">VecIndex</code>.</li>
<li>Tambahkan logika pembangunan indeks untuk indeks baru di <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>Tambahkan unit test di bawah direktori <code translate="no">unittest</code>.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Tentang Seri Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">pengumuman resmi ketersediaan umum</a> Milvus 2.0, kami menyusun seri blog Milvus Deep Dive ini untuk memberikan interpretasi mendalam tentang arsitektur dan kode sumber Milvus. Topik-topik yang dibahas dalam seri blog ini meliputi:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Gambaran umum arsitektur Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API dan SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Pemrosesan data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Manajemen data</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Kueri waktu nyata</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Mesin eksekusi skalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistem QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Mesin eksekusi vektor</a></li>
</ul>
