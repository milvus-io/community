---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 &amp; 2.2.11: Pembaruan Kecil untuk Peningkatan Stabilitas
  Sistem dan Pengalaman Pengguna
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Memperkenalkan fitur-fitur baru dan peningkatan dari Milvus 2.2.10 dan 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Salam, para penggemar Milvus! Kami dengan senang hati mengumumkan bahwa kami baru saja merilis Milvus 2.2.10 dan 2.2.11, dua pembaruan kecil yang berfokus pada perbaikan bug dan peningkatan kinerja secara keseluruhan. Anda dapat mengharapkan sistem yang lebih stabil dan pengalaman pengguna yang lebih baik dengan dua pembaruan tersebut. Mari kita lihat sekilas apa saja yang baru dalam kedua rilis ini.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 telah memperbaiki kerusakan sistem yang sesekali terjadi, mempercepat pemuatan dan pengindeksan, mengurangi penggunaan memori di simpul data, dan membuat banyak perbaikan lainnya. Di bawah ini adalah beberapa perubahan penting:</p>
<ul>
<li>Mengganti penulis payload CGO yang lama dengan yang baru yang ditulis dalam bahasa Go murni, sehingga mengurangi penggunaan memori dalam node data.</li>
<li>Menambahkan <code translate="no">go-api/v2</code> ke file <code translate="no">milvus-proto</code> untuk mencegah kebingungan dengan versi <code translate="no">milvus-proto</code> yang berbeda.</li>
<li>Meningkatkan Gin dari versi 1.9.0 ke 1.9.1 untuk memperbaiki bug pada fungsi <code translate="no">Context.FileAttachment</code>.</li>
<li>Menambahkan kontrol akses berbasis peran (RBAC) untuk FlushAll dan Database API.</li>
<li>Memperbaiki kerusakan acak yang disebabkan oleh AWS S3 SDK.</li>
<li>Meningkatkan kecepatan pemuatan dan pengindeksan.</li>
</ul>
<p>Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md#2210">Catatan Rilis Milvus 2.2.10.</a></p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 telah menyelesaikan berbagai masalah untuk meningkatkan stabilitas sistem. Milvus 2.2.11 juga telah meningkatkan kinerjanya dalam pemantauan, pencatatan, pembatasan kecepatan, dan intersepsi permintaan lintas cluster. Lihat di bawah ini untuk melihat sorotan dari pembaruan ini.</p>
<ul>
<li>Menambahkan pencegat ke server Milvus GRPC untuk mencegah masalah dengan perutean Cross-Cluster.</li>
<li>Menambahkan kode kesalahan ke minio chunk manager untuk mempermudah diagnosa dan memperbaiki kesalahan.</li>
<li>Memanfaatkan kumpulan coroutine tunggal untuk menghindari pemborosan coroutine dan memaksimalkan penggunaan sumber daya.</li>
<li>Mengurangi penggunaan disk untuk RocksMq hingga sepersepuluh dari tingkat aslinya dengan mengaktifkan kompresi zstd.</li>
<li>Memperbaiki kepanikan QueryNode yang sesekali terjadi selama pemuatan.</li>
<li>Memperbaiki masalah pelambatan permintaan baca yang disebabkan oleh kesalahan penghitungan panjang antrian dua kali.</li>
<li>Memperbaiki masalah dengan GetObject yang mengembalikan nilai null di MacOS.</li>
<li>Memperbaiki kerusakan yang disebabkan oleh penggunaan pengubah noexcept yang salah.</li>
</ul>
<p>Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md#2211">Catatan Rilis Milvus 2.2.11</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Mari tetap berkomunikasi!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
