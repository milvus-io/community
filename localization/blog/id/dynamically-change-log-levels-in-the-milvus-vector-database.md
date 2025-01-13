---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Mengubah Level Log Secara Dinamis dalam Database Vektor Milvus
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: Pelajari cara menyesuaikan tingkat log di Milvus tanpa memulai ulang layanan.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar sampul depan</span> </span></p>
<blockquote>
<p>Artikel ini ditulis oleh <a href="https://github.com/jiaoew1991">Enwei Jiao</a> dan diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Untuk mencegah keluaran log yang berlebihan yang mempengaruhi kinerja disk dan sistem, Milvus secara default mengeluarkan log pada level <code translate="no">info</code> saat berjalan. Namun, terkadang log pada level <code translate="no">info</code> tidak cukup memadai untuk membantu kami mengidentifikasi bug dan masalah secara efisien. Lebih buruk lagi, dalam beberapa kasus, mengubah level log dan memulai ulang layanan dapat menyebabkan kegagalan mereproduksi masalah, membuat pemecahan masalah menjadi lebih sulit. Oleh karena itu, dukungan untuk mengubah level log secara dinamis dalam basis data vektor Milvus sangat dibutuhkan.</p>
<p>Artikel ini bertujuan untuk memperkenalkan mekanisme di balik yang memungkinkan perubahan level log secara dinamis dan memberikan instruksi tentang cara melakukannya dalam database vektor Milvus.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#Mechanism">Mekanisme</a></li>
<li><a href="#How-to-dynamically-change-log-levels">Cara mengubah level log secara dinamis</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Mekanisme<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor Milvus mengadopsi <a href="https://github.com/uber-go/zap">zap</a> logger yang bersumber terbuka dari Uber. Sebagai salah satu komponen log yang paling kuat dalam ekosistem bahasa Go, zap menggabungkan modul <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> sehingga Anda dapat melihat level log saat ini dan secara dinamis mengubah level log melalui antarmuka HTTP.</p>
<p>Milvus mendengarkan layanan HTTP yang disediakan oleh port <code translate="no">9091</code>. Oleh karena itu, Anda dapat mengakses port <code translate="no">9091</code> untuk memanfaatkan fitur-fitur seperti debugging kinerja, metrik, pemeriksaan kesehatan. Demikian pula, port <code translate="no">9091</code> digunakan kembali untuk memungkinkan modifikasi level log dinamis dan jalur <code translate="no">/log/level</code> juga ditambahkan ke port. Lihat<a href="https://github.com/milvus-io/milvus/pull/18430"> PR antarmuka log</a> untuk informasi lebih lanjut.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">Cara mengubah level log secara dinamis<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagian ini menyediakan instruksi tentang cara mengubah level log secara dinamis tanpa perlu memulai ulang layanan Milvus yang sedang berjalan.</p>
<h3 id="Prerequisite" class="common-anchor-header">Prasyarat</h3><p>Pastikan Anda dapat mengakses port <code translate="no">9091</code> pada komponen Milvus.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Mengubah level log</h3><p>Misalkan alamat IP proksi Milvus adalah <code translate="no">192.168.48.12</code>.</p>
<p>Anda dapat menjalankan <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> terlebih dahulu untuk memeriksa level log proxy saat ini.</p>
<p>Kemudian Anda dapat melakukan penyesuaian dengan menentukan level log. Opsi tingkat log termasuk:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>Contoh kode berikut ini mengubah level log dari level log default dari <code translate="no">info</code> ke <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
