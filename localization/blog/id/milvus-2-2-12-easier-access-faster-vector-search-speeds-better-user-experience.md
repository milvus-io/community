---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >-
  Milvus 2.2.12: Akses yang Lebih Mudah, Kecepatan Pencarian Vektor yang Lebih
  Cepat, dan Pengalaman Pengguna yang Lebih Baik
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami dengan senang hati mengumumkan rilis terbaru Milvus 2.2.12. Pembaruan ini mencakup beberapa fitur baru, seperti dukungan untuk RESTful API, fungsi <code translate="no">json_contains</code>, dan pengambilan vektor selama pencarian ANN sebagai tanggapan atas umpan balik pengguna. Kami juga telah menyederhanakan pengalaman pengguna, meningkatkan kecepatan pencarian vektor, dan menyelesaikan banyak masalah. Mari kita pelajari apa saja yang dapat kita harapkan dari Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Dukungan untuk RESTful API<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 sekarang mendukung RESTful API, yang memungkinkan pengguna untuk mengakses Milvus tanpa menginstal klien, membuat operasi klien-server menjadi lebih mudah. Selain itu, penerapan Milvus menjadi lebih mudah karena Milvus SDK dan RESTful API memiliki nomor port yang sama.</p>
<p><strong>Catatan</strong>: Kami tetap merekomendasikan penggunaan SDK untuk menerapkan Milvus untuk operasi tingkat lanjut atau jika bisnis Anda sensitif terhadap latensi.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Pengambilan vektor selama pencarian ANN<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada versi sebelumnya, Milvus tidak mengizinkan pengambilan vektor selama pencarian perkiraan tetangga terdekat (ANN) untuk memprioritaskan kinerja dan penggunaan memori. Akibatnya, pengambilan vektor mentah harus dibagi menjadi dua langkah: melakukan pencarian ANN dan kemudian meminta vektor mentah berdasarkan ID mereka. Pendekatan ini meningkatkan biaya pengembangan dan mempersulit pengguna untuk menggunakan dan mengadopsi Milvus.</p>
<p>Dengan Milvus 2.2.12, pengguna dapat mengambil vektor mentah selama pencarian ANN dengan mengatur bidang vektor sebagai bidang keluaran dan melakukan kueri dalam koleksi yang diindeks HNSW, DiskANN, atau IVF-FLAT. Selain itu, pengguna dapat mengharapkan kecepatan pengambilan vektor yang jauh lebih cepat.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Dukungan untuk operasi pada array JSON<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami baru-baru ini menambahkan dukungan untuk JSON di Milvus 2.2.8. Sejak saat itu, para pengguna telah mengirimkan banyak permintaan untuk mendukung operasi-operasi tambahan pada larik JSON, seperti inklusi, eksklusi, interseksi, penyatuan, selisih, dan banyak lagi. Di Milvus 2.2.12, kami memprioritaskan dukungan terhadap fungsi <code translate="no">json_contains</code> untuk mengaktifkan operasi inklusi. Kami akan terus menambahkan dukungan untuk operator lain di versi mendatang.</p>
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
    </button></h2><p>Selain memperkenalkan fitur-fitur baru, Milvus 2.2.12 telah meningkatkan kinerja pencarian vektor dengan mengurangi overhead, sehingga lebih mudah untuk menangani pencarian topk yang ekstensif. Selain itu, ia meningkatkan kinerja penulisan dalam situasi yang mendukung kunci partisi dan multi-partisi serta mengoptimalkan penggunaan CPU untuk mesin yang besar. Pembaruan ini mengatasi berbagai masalah: penggunaan disk yang berlebihan, pemadatan yang macet, penghapusan data yang jarang terjadi, dan kegagalan penyisipan massal. Untuk informasi lebih lanjut, silakan lihat <a href="https://milvus.io/docs/release_notes.md#2212">Catatan Rilis Milvus 2.2.12.</a></p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">Mari tetap terhubung!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda memiliki pertanyaan atau masukan mengenai Milvus, jangan ragu untuk menghubungi kami melalui <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Anda juga dapat bergabung dengan <a href="https://milvus.io/slack/">saluran Slack</a> kami untuk mengobrol dengan para insinyur dan komunitas kami secara langsung atau melihat <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">jam kerja</a> kami di hari <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Selasa</a>!</p>
