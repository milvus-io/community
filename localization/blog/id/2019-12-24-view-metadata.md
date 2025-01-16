---
id: 2019-12-24-view-metadata.md
title: Manajemen Metadata Milvus (1) Cara Melihat Metadata
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  Milvus mendukung penyimpanan metadata dalam SQLite atau MySQL. Postingan ini
  memperkenalkan cara melihat metadata dengan SQLite dan MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Manajemen Metadata Milvus (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">Cara Melihat Metadata<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><blockquote>
<p>Penulis Yihua Mo</p>
<p>Tanggal: 2019-12-24</p>
</blockquote>
<p>Kami memperkenalkan beberapa informasi tentang metadata di <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Mengelola Data di Mesin Pencari Vektor Skala Besar</a>. Artikel ini terutama menunjukkan cara melihat metadata Milvus.</p>
<p>Milvus mendukung penyimpanan metadata di SQLite atau MySQL. Ada sebuah parameter <code translate="no">backend_url</code> (dalam file konfigurasi <code translate="no">server_config.yaml</code>) dimana Anda dapat menentukan apakah akan menggunakan SQLite atau MySQL untuk mengelola metadata Anda.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>Jika SQLite digunakan, sebuah file <code translate="no">meta.sqlite</code> akan dibuat di direktori data (didefinisikan di <code translate="no">primary_path</code> dari file konfigurasi <code translate="no">server_config.yaml</code>) setelah Milvus dijalankan. Untuk melihat file tersebut, Anda hanya perlu menginstal klien SQLite.</p>
<p>Instal SQLite3 dari baris perintah:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian masuk ke direktori data Milvus, dan buka file meta menggunakan SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang, Anda sudah masuk ke dalam baris perintah klien SQLite. Cukup gunakan beberapa perintah untuk melihat apa yang ada di dalam metadata.</p>
<p>Untuk membuat hasil cetak menjadi lebih mudah dibaca oleh manusia:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>Untuk menanyakan Tabel dan TableFile menggunakan pernyataan SQL (tidak peka huruf besar/kecil):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>Jika Anda menggunakan MySQL, Anda perlu menentukan alamat layanan MySQL di <code translate="no">backend_url</code> pada file konfigurasi <code translate="no">server_config.yaml</code>.</p>
<p>Sebagai contoh, pengaturan berikut ini menunjukkan bahwa layanan MySQL digunakan secara lokal, dengan port '3306', nama pengguna 'root', kata sandi '123456', dan nama basis data 'milvus':</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Pertama-tama, instal klien MySQL:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>Setelah Milvus dijalankan, dua tabel (Tables dan TableFiles) akan dibuat pada layanan MySQL yang ditentukan oleh <code translate="no">backend_url</code>.</p>
<p>Gunakan perintah berikut untuk terhubung ke layanan MySQL:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang, Anda dapat menggunakan pernyataan SQL untuk menanyakan informasi metadata:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png" alt="mysql" class="doc-image" id="mysql" />
   </span> <span class="img-wrapper"> <span>mysql</span> </span></p>
<h2 id="相关博客" class="common-anchor-header">MENGELOLA DATA DALAM VEKTOR SKALA MASIF<button data-href="#相关博客" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Mengelola Data di Mesin Pencari Vektor Skala Besar</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Manajemen Metadata Milvus (2): Kolom dalam Tabel Metadata</a></li>
</ul>
