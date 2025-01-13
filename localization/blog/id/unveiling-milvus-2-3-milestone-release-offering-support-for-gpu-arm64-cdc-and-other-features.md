---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Peluncuran Milvus 2.3: Rilis Penting yang Menawarkan Dukungan untuk GPU,
  Arm64, CDC, dan Banyak Fitur Lain yang Sangat Diantisipasi
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 merupakan rilis penting dengan berbagai fitur yang sangat
  dinantikan, termasuk dukungan untuk GPU, Arm64, upsert, perubahan pengambilan
  data, indeks ScaNN, dan pencarian rentang. Milvus 2.3 juga memperkenalkan
  peningkatan performa kueri, penyeimbangan dan penjadwalan beban yang lebih
  kuat, serta pengamatan dan pengoperasian yang lebih baik.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Berita yang menggembirakan! Setelah delapan bulan bekerja keras, kami dengan senang hati mengumumkan perilisan Milvus 2.3, sebuah versi penting yang membawa banyak fitur yang sangat dinanti, termasuk dukungan untuk GPU, Arm64, upsert, perubahan pengambilan data, indeks ScaNN, dan teknologi MMap. Milvus 2.3 juga memperkenalkan peningkatan performa kueri, penyeimbangan dan penjadwalan beban yang lebih kuat, serta pengamatan dan pengoperasian yang lebih baik.</p>
<p>Bergabunglah dengan saya untuk melihat fitur-fitur baru dan peningkatan ini dan pelajari bagaimana Anda dapat mengambil manfaat dari rilis ini.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Dukungan untuk indeks GPU yang menghasilkan 3-10 kali lebih cepat dalam QPS<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>Indeks GPU adalah fitur yang sangat dinanti-nantikan di komunitas Milvus. Berkat kolaborasi yang hebat dengan para insinyur Nvidia, Milvus 2.3 telah mendukung pengindeksan GPU dengan algoritma RAFT yang kuat yang ditambahkan ke Knowhere, mesin indeks Milvus. Dengan dukungan GPU, Milvus 2.3 lebih dari tiga kali lebih cepat dalam QPS dibandingkan versi sebelumnya yang menggunakan indeks CPU HNSW dan hampir sepuluh kali lebih cepat untuk set data tertentu yang membutuhkan komputasi berat.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Dukungan Arm64 untuk mengakomodasi permintaan pengguna yang terus meningkat<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>CPU Arm menjadi semakin populer di kalangan penyedia dan pengembang cloud. Untuk memenuhi permintaan yang terus meningkat ini, Milvus kini menyediakan image Docker untuk arsitektur ARM64. Dengan dukungan CPU baru ini, pengguna MacOS dapat membangun aplikasi mereka dengan Milvus dengan lebih mulus.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Peningkatan dukungan untuk pengalaman pengguna yang lebih baik<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 memperkenalkan peningkatan penting dengan mendukung operasi upsert. Fungsionalitas baru ini memungkinkan pengguna untuk memperbarui atau menyisipkan data dengan lancar dan memberdayakan mereka untuk melakukan kedua operasi tersebut dalam satu permintaan melalui antarmuka Upsert. Fitur ini menyederhanakan manajemen data dan menghadirkan efisiensi.</p>
<p><strong>Catatan</strong>:</p>
<ul>
<li>Fitur upsert tidak berlaku untuk ID kenaikan otomatis.</li>
<li>Upsert diimplementasikan sebagai kombinasi dari <code translate="no">delete</code> dan <code translate="no">insert</code>, yang dapat mengakibatkan beberapa penurunan kinerja. Kami menyarankan untuk menggunakan <code translate="no">insert</code> jika Anda menggunakan Milvus dalam skenario penulisan yang berat.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Pencarian rentang untuk hasil yang lebih akurat<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 memungkinkan pengguna untuk menentukan jarak antara vektor input dan vektor yang disimpan dalam Milvus selama kueri. Milvus kemudian mengembalikan semua hasil yang cocok dalam jarak yang ditentukan. Di bawah ini adalah contoh menentukan jarak pencarian menggunakan fitur pencarian jarak.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Dalam contoh ini, pengguna meminta Milvus untuk mengembalikan vektor dalam jarak 10 hingga 20 unit dari vektor input.</p>
<p><strong>Catatan</strong>: Metrik jarak yang berbeda memiliki cara yang berbeda dalam menghitung jarak, sehingga menghasilkan rentang nilai dan strategi pengurutan yang berbeda. Oleh karena itu, penting untuk memahami karakteristiknya sebelum menggunakan fitur pencarian jarak.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">Indeks ScaNN untuk kecepatan kueri yang lebih cepat<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 sekarang mendukung indeks ScaNN, sebuah indeks <a href="https://zilliz.com/glossary/anns">perkiraan tetangga terdekat (ANN)</a> sumber terbuka yang dikembangkan oleh Google. Indeks ScaNN telah menunjukkan kinerja yang unggul dalam berbagai benchmark, mengungguli HNSW sekitar 20% dan sekitar tujuh kali lebih cepat dari IVFFlat. Dengan dukungan untuk indeks ScaNN, Milvus mencapai kecepatan kueri yang jauh lebih cepat dibandingkan dengan versi sebelumnya.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Indeks yang terus berkembang untuk kinerja kueri yang stabil dan lebih baik<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus mencakup dua kategori data: data yang diindeks dan data streaming. Milvus dapat menggunakan indeks untuk mencari data yang diindeks dengan cepat, tetapi hanya dapat mencari data streaming baris per baris, yang dapat memengaruhi kinerja. Milvus 2.3 memperkenalkan Growing Index, yang secara otomatis membuat indeks real-time untuk data streaming untuk meningkatkan kinerja kueri.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Iterator untuk pengambilan data dalam batch<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam Milvus 2.3, Pymilvus telah memperkenalkan antarmuka iterator yang memungkinkan pengguna untuk mengambil lebih dari 16.384 entitas dalam pencarian atau pencarian rentang. Fitur ini sangat berguna ketika pengguna perlu mengekspor puluhan ribu atau bahkan lebih banyak vektor secara berkelompok.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Dukungan untuk MMap untuk meningkatkan kapasitas<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap adalah sebuah system call UNIX yang digunakan untuk memetakan file dan objek lain ke dalam memori. Milvus 2.3 mendukung MMap, yang memungkinkan pengguna untuk memuat data ke dalam disk lokal dan memetakannya ke dalam memori, sehingga meningkatkan kapasitas mesin tunggal.</p>
<p>Hasil pengujian kami menunjukkan bahwa dengan menggunakan teknologi MMap, Milvus dapat menggandakan kapasitas datanya sekaligus membatasi penurunan performa hingga 20%. Pendekatan ini secara signifikan mengurangi biaya keseluruhan, sehingga sangat bermanfaat bagi pengguna dengan anggaran terbatas yang tidak keberatan mengorbankan kinerja.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">Dukungan CDC untuk ketersediaan sistem yang lebih tinggi<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>Change Data Capture (CDC) adalah fitur yang umum digunakan dalam sistem basis data yang menangkap dan mereplikasi perubahan data ke tujuan yang telah ditentukan. Dengan fitur CDC, Milvus 2.3 memungkinkan pengguna untuk melakukan sinkronisasi data di seluruh pusat data, mencadangkan data tambahan, dan memigrasi data dengan lancar, sehingga sistem lebih tersedia.</p>
<p>Selain fitur-fitur di atas, Milvus 2.3 memperkenalkan antarmuka penghitungan untuk menghitung jumlah baris data yang tersimpan dalam koleksi secara akurat dalam waktu nyata, mendukung metrik Cosinus untuk mengukur jarak vektor, dan lebih banyak operasi pada array JSON. Untuk fitur-fitur lainnya dan informasi lebih lanjut, lihat <a href="https://milvus.io/docs/release_notes.md">catatan rilis Milvus 2.3</a>.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Peningkatan dan perbaikan bug<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain fitur-fitur baru, Milvus 2.3 mencakup banyak peningkatan dan perbaikan bug untuk versi sebelumnya.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Peningkatan kinerja untuk pemfilteran data</h3><p>Milvus melakukan pemfilteran skalar sebelum pencarian vektor dalam kueri data hibrida skalar dan vektor untuk mencapai hasil yang lebih akurat. Namun, performa pengindeksan dapat menurun jika pengguna menyaring terlalu banyak data setelah pemfilteran skalar. Di Milvus 2.3, kami mengoptimalkan strategi pemfilteran HNSW untuk mengatasi masalah ini, sehingga menghasilkan kinerja kueri yang lebih baik.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Peningkatan penggunaan CPU multi-core</h3><p>Perkiraan pencarian terdekat (ANN) adalah tugas intensif secara komputasi yang membutuhkan sumber daya CPU yang sangat besar. Pada rilis sebelumnya, Milvus hanya dapat menggunakan sekitar 70% dari sumber daya CPU multi-core yang tersedia. Namun, dengan rilis terbaru, Milvus telah mengatasi keterbatasan ini dan dapat sepenuhnya memanfaatkan semua sumber daya CPU multi-core yang tersedia, sehingga menghasilkan peningkatan kinerja kueri dan mengurangi pemborosan sumber daya.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">QueryNode yang telah direfaktor</h3><p>QueryNode adalah komponen penting dalam Milvus yang bertanggung jawab untuk pencarian vektor. Namun, pada versi yang lebih lama, QueryNode memiliki status yang kompleks, antrian pesan yang duplikat, struktur kode yang tidak terorganisir, dan pesan kesalahan yang tidak intuitif.</p>
<p>Di Milvus 2.3, kami telah meningkatkan QueryNode dengan memperkenalkan struktur kode tanpa status dan menghapus antrean pesan untuk menghapus data. Pembaruan ini menghasilkan lebih sedikit pemborosan sumber daya dan pencarian vektor yang lebih cepat dan lebih stabil.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Antrian pesan yang disempurnakan berdasarkan NATS</h3><p>Kami membangun Milvus dengan arsitektur berbasis log, dan pada versi sebelumnya, kami menggunakan Pulsar dan Kafka sebagai perantara log inti. Namun, kombinasi ini menghadapi tiga tantangan utama:</p>
<ul>
<li>Tidak stabil dalam situasi multi-topik.</li>
<li>Kombinasi ini menghabiskan sumber daya saat tidak digunakan dan kesulitan untuk menduplikasi pesan.</li>
<li>Pulsar dan Kafka sangat terkait dengan ekosistem Java, sehingga komunitas mereka jarang memelihara dan memperbarui Go SDK mereka.</li>
</ul>
<p>Untuk mengatasi masalah ini, kami telah menggabungkan NATS dan Bookeeper sebagai broker log baru kami untuk Milvus, yang lebih sesuai dengan kebutuhan pengguna.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Penyeimbang beban yang dioptimalkan</h3><p>Milvus 2.3 telah mengadopsi algoritme penyeimbang beban yang lebih fleksibel berdasarkan beban nyata sistem. Algoritma yang dioptimalkan ini memungkinkan pengguna dengan cepat mendeteksi kegagalan node dan beban yang tidak seimbang dan menyesuaikan penjadwalan yang sesuai. Menurut hasil pengujian kami, Milvus 2.3 dapat mendeteksi kesalahan, beban yang tidak seimbang, status node yang tidak normal, dan kejadian lainnya dalam hitungan detik dan melakukan penyesuaian dengan segera.</p>
<p>Untuk informasi lebih lanjut tentang Milvus 2.3, lihat <a href="https://milvus.io/docs/release_notes.md">catatan rilis Milvus 2.3</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Peningkatan alat<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami juga telah meningkatkan Birdwatcher dan Attu, dua alat yang sangat berharga untuk mengoperasikan dan memelihara Milvus, bersama dengan Milvus 2.3.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Pembaruan Birdwatcher</h3><p>Kami telah meningkatkan <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>, alat debug dari Milvus, dengan memperkenalkan berbagai fitur dan peningkatan, termasuk:</p>
<ul>
<li>RESTful API untuk integrasi tanpa batas dengan sistem diagnostik lainnya.</li>
<li>Dukungan perintah PProf untuk memfasilitasi integrasi dengan alat Go pprof.</li>
<li>Kemampuan analisis penggunaan penyimpanan.</li>
<li>Fungsionalitas analisis log yang efisien.</li>
<li>Dukungan untuk melihat dan memodifikasi konfigurasi di etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Pembaruan Attu</h3><p>Kami telah meluncurkan antarmuka baru untuk <a href="https://zilliz.com/attu">Attu</a>, alat administrasi basis data vektor yang lengkap. Antarmuka baru ini memiliki desain yang lebih sederhana dan lebih mudah dipahami.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md">catatan rilis Milvus 2.3</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Mari tetap terhubung!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda memiliki pertanyaan atau masukan mengenai Milvus, jangan ragu untuk menghubungi kami melalui <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Anda juga dapat bergabung dengan <a href="https://milvus.io/slack/">saluran Slack</a> kami untuk mengobrol dengan para insinyur dan komunitas kami secara langsung atau lihat <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">jam kerja</a> kami di hari <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Selasa</a>!</p>
