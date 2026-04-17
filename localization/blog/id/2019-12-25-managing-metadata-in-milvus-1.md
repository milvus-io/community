---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: Mempelajari cara melihat metadata dalam database vektor Milvus.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Manajemen Metadata Milvus (1)</custom-h1><p>Kami telah memperkenalkan beberapa informasi tentang metadata di artikel <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Mengelola Data di Mesin Pencari Vektor Berskala Besar</a>. Artikel ini terutama menunjukkan cara melihat metadata Milvus.</p>
<p>Milvus mendukung penyimpanan metadata di SQLite atau MySQL. Ada sebuah parameter <code translate="no">backend_url</code> (dalam file konfigurasi <code translate="no">server_config.yaml</code>) dimana Anda dapat menentukan apakah akan menggunakan SQLite atau MySQL untuk mengelola metadata Anda.</p>
<h2 id="SQLite" class="common-anchor-header">SQLite<button data-href="#SQLite" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika SQLite digunakan, sebuah file <code translate="no">meta.sqlite</code> akan dibuat di direktori data (didefinisikan di <code translate="no">primary_path</code> dari file konfigurasi <code translate="no">server_config.yaml</code>) setelah Milvus dijalankan. Untuk melihat file tersebut, Anda hanya perlu menginstal klien SQLite.</p>
<p>Instal SQLite3 dari baris perintah:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>Kemudian masuk ke direktori data Milvus, dan buka file meta menggunakan SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Sekarang, Anda sudah masuk ke dalam baris perintah klien SQLite. Cukup gunakan beberapa perintah untuk melihat apa yang ada di dalam metadata.</p>
<p>Untuk membuat hasil cetak menjadi lebih mudah dibaca oleh manusia:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>Untuk menanyakan Tabel dan TableFile menggunakan pernyataan SQL (tidak peka huruf besar/kecil):</p>
<pre><code translate="no">SELECT * FROM Tables
SELECT * FROM TableFiles
</code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png" alt="1-use-sql-lite.png" class="doc-image" id="1-use-sql-lite.png" />
   </span> <span class="img-wrapper"> <span>1-penggunaan-sql-lite.png</span> </span></p>
<h2 id="MySQL" class="common-anchor-header">MySQL<button data-href="#MySQL" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda menggunakan MySQL, Anda perlu menentukan alamat layanan MySQL di <code translate="no">backend_url</code> pada file konfigurasi <code translate="no">server_config.yaml</code>.</p>
<p>Sebagai contoh, pengaturan berikut ini menunjukkan bahwa layanan MySQL digunakan secara lokal, dengan port '3306', nama pengguna 'root', kata sandi '123456', dan nama basis data 'milvus':</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>Pertama-tama, instal klien MySQL:</p>
<p>sudo apt-get install install default-mysql-client</p>
<p>Setelah Milvus dijalankan, dua tabel (Tables dan TableFiles) akan dibuat dalam layanan MySQL yang ditentukan oleh <code translate="no">backend_url</code>.</p>
<p>Gunakan perintah berikut untuk terhubung ke layanan MySQL:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Sekarang, Anda dapat menggunakan pernyataan SQL untuk menanyakan informasi metadata:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Apa yang akan datang selanjutnya<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Artikel selanjutnya akan memperkenalkan secara detail skema tabel metadata. Nantikan terus!</p>
<p>Jika ada pertanyaan, silakan bergabung dengan <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">saluran Slack</a> kami atau ajukan masalah di repo.</p>
<p>Repositori GitHub: https://github.com/milvus-io/milvus</p>
<p>Jika Anda menyukai artikel ini atau merasa artikel ini bermanfaat, jangan lupa untuk bertepuk tangan!</p>
