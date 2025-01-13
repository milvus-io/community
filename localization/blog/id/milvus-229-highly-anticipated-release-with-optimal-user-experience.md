---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: >-
  Milvus 2.2.9: Rilis yang Sangat Dinantikan dengan Pengalaman Pengguna yang
  Optimal
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami dengan senang hati mengumumkan kehadiran Milvus 2.2.9, rilis yang sangat dinanti-nantikan yang menandai tonggak penting bagi tim dan komunitas. Rilis ini menawarkan banyak fitur menarik, termasuk dukungan yang telah lama ditunggu-tunggu untuk tipe data JSON, skema dinamis, dan kunci partisi, memastikan pengalaman pengguna yang dioptimalkan dan alur kerja pengembangan yang efisien. Selain itu, rilis ini juga dilengkapi dengan berbagai peningkatan dan perbaikan bug. Bergabunglah bersama kami dalam menjelajahi Milvus 2.2.9 dan temukan mengapa rilis ini sangat menarik.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Pengalaman pengguna yang dioptimalkan dengan dukungan JSON<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus telah memperkenalkan dukungan yang sangat dinanti-nantikan untuk tipe data JSON, yang memungkinkan penyimpanan data JSON tanpa hambatan bersama dengan metadata vektor di dalam koleksi pengguna. Dengan peningkatan ini, pengguna dapat secara efisien memasukkan data JSON secara massal dan melakukan kueri dan penyaringan tingkat lanjut berdasarkan konten bidang JSON mereka. Selain itu, pengguna dapat memanfaatkan ekspresi dan melakukan operasi yang disesuaikan dengan bidang JSON dataset mereka, membuat kueri, dan menerapkan filter berdasarkan konten dan struktur bidang JSON mereka, sehingga mereka dapat mengekstrak informasi yang relevan dan memanipulasi data dengan lebih baik.</p>
<p>Di masa mendatang, tim Milvus akan menambahkan indeks untuk field dalam tipe JSON, yang akan semakin mengoptimalkan kinerja kueri skalar dan vektor campuran. Jadi, nantikan perkembangan menarik di masa mendatang!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Menambahkan fleksibilitas dengan dukungan untuk skema dinamis<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan dukungan untuk data JSON, Milvus 2.2.9 sekarang menyediakan fungsionalitas skema dinamis melalui perangkat pengembangan perangkat lunak yang disederhanakan (SDK).</p>
<p>Dimulai dengan Milvus 2.2.9, Milvus SDK menyertakan API tingkat tinggi yang secara otomatis mengisi bidang dinamis ke dalam bidang JSON yang tersembunyi pada koleksi, sehingga pengguna dapat berkonsentrasi hanya pada bidang bisnis mereka.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Pemisahan data yang lebih baik dan efisiensi pencarian yang lebih baik dengan Partition Key<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 meningkatkan kemampuan partisi dengan memperkenalkan fitur Partition Key. Fitur ini memungkinkan kolom khusus pengguna sebagai kunci utama untuk mempartisi, sehingga tidak perlu lagi menggunakan API tambahan seperti <code translate="no">loadPartition</code> dan <code translate="no">releasePartition</code>. Fitur baru ini juga menghilangkan batasan jumlah partisi, yang mengarah pada pemanfaatan sumber daya yang lebih efisien.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Dukungan untuk Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 kini mendukung Alibaba Cloud Object Storage Service (OSS). Pengguna Alibaba Cloud dapat dengan mudah mengonfigurasi <code translate="no">cloudProvider</code> ke Alibaba Cloud dan memanfaatkan integrasi tanpa batas untuk penyimpanan dan pengambilan data vektor yang efisien di cloud.</p>
<p>Selain fitur-fitur yang telah disebutkan sebelumnya, Milvus 2.2.9 menawarkan dukungan basis data dalam Role-Based Access Control (RBAC), memperkenalkan manajemen koneksi, dan menyertakan beberapa peningkatan dan perbaikan bug. Untuk informasi lebih lanjut, lihat <a href="https://milvus.io/docs/release_notes.md">Catatan Rilis Milvus 2.2.9</a>.</p>
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
    </button></h2><p>Jika Anda memiliki pertanyaan atau umpan balik tentang Milvus, jangan ragu untuk menghubungi kami melalui <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Anda juga dapat bergabung dengan <a href="https://milvus.io/slack/">saluran Slack</a> untuk mengobrol dengan teknisi dan komunitas kami secara langsung atau melihat <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">jam kerja</a> kami di hari <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Selasa</a>!</p>
