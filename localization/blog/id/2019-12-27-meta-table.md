---
id: 2019-12-27-meta-table.md
title: Manajemen Metadata Milvus (2) Bidang dalam Tabel Metadata
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Pelajari tentang detail bidang dalam tabel metadata di Milvus.
cover: null
tag: Engineering
---
<custom-h1>Manajemen Metadata Milvus (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Kolom-kolom dalam Tabel Metadata<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
<p>Tanggal: 2019-12-27</p>
</blockquote>
<p>Di blog terakhir, kami menyebutkan cara melihat metadata Anda menggunakan MySQL atau SQLite. Artikel ini terutama bermaksud untuk memperkenalkan secara rinci bidang-bidang dalam tabel metadata.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Bidang dalam tabel &quot;<code translate="no">Tables</code>&quot;</h3><p>Ambil SQLite sebagai contoh. Hasil berikut ini berasal dari 0.5.0. Beberapa field ditambahkan ke 0.6.0, yang akan diperkenalkan nanti. Ada satu baris di <code translate="no">Tables</code> yang menyatakan tabel vektor 512 dimensi dengan nama <code translate="no">table_1</code>. Ketika tabel dibuat, <code translate="no">index_file_size</code> adalah 1024 MB, <code translate="no">engine_type</code> adalah 1 (FLAT), <code translate="no">nlist</code> adalah 16384, <code translate="no">metric_type</code> adalah 1 (jarak Euclidean L2). <code translate="no">id</code> adalah pengenal unik dari tabel. <code translate="no">state</code> adalah status dari tabel dengan angka 0 yang mengindikasikan status normal. <code translate="no">created_on</code> adalah waktu pembuatan. <code translate="no">flag</code> adalah flag yang dicadangkan untuk penggunaan internal.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>tabel</span> </span></p>
<p>Tabel berikut ini menunjukkan jenis bidang dan deskripsi bidang di <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Nama Field</th><th style="text-align:left">Tipe Data</th><th style="text-align:left">Deskripsi</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Pengenal unik dari tabel vektor. <code translate="no">id</code> bertambah secara otomatis.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nama tabel vektor. <code translate="no">table_id</code> harus ditentukan oleh pengguna dan mengikuti panduan nama file Linux.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">Status dari tabel vektor. 0 berarti normal dan 1 berarti terhapus (soft delete).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Dimensi vektor dari tabel vektor. Harus ditentukan oleh pengguna.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Jumlah milidetik dari 1 Januari 1970 hingga saat tabel dibuat.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Bendera untuk penggunaan internal, seperti apakah id vektor ditentukan oleh pengguna. Nilai standarnya adalah 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Jika ukuran file data mencapai <code translate="no">index_file_size</code>, file tersebut tidak digabungkan dan digunakan untuk membangun indeks. Standarnya adalah 1024 (MB).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Jenis indeks yang akan dibuat untuk tabel vektor. Standarnya adalah 0, yang menandakan indeks tidak valid. 1 menentukan FLAT. 2 menentukan IVFLAT. 3 menentukan IVFSQ8. 4 menentukan NSG. 5 menentukan IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Jumlah kluster vektor dalam setiap file data dibagi menjadi beberapa kluster ketika indeks sedang dibangun. Nilai standarnya adalah 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Metode untuk menghitung jarak vektor. 1 menentukan jarak Euclidean (L1) dan 2 menentukan inner product.</td></tr>
</tbody>
</table>
<p>Pemartisian tabel diaktifkan di 0.6.0 dengan beberapa bidang baru, termasuk <code translate="no">owner_table</code>,<code translate="no">partition_tag</code> dan <code translate="no">version</code>. Sebuah tabel vektor, <code translate="no">table_1</code>, memiliki sebuah partisi yang disebut <code translate="no">table_1_p1</code>, yang juga merupakan sebuah tabel vektor. <code translate="no">partition_name</code> berhubungan dengan <code translate="no">table_id</code>. Field dalam tabel partisi diwarisi dari tabel pemilik, dengan field <code translate="no">owner table</code> yang menentukan nama tabel pemilik dan field <code translate="no">partition_tag</code> yang menentukan tag partisi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tabel_baru</span> </span></p>
<p>Tabel berikut ini menunjukkan field-field baru di 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">Nama Field</th><th style="text-align:left">Tipe Data</th><th style="text-align:left">Deskripsi</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">string</td><td style="text-align:left">Tabel induk dari partisi.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">string</td><td style="text-align:left">Tag dari partisi. Tidak boleh berupa string kosong.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">string</td><td style="text-align:left">Versi Milvus.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Bidang-bidang dalam tabel "<code translate="no">TableFiles&quot;</code> </h3><p>Contoh berikut ini berisi dua berkas, yang keduanya merupakan bagian dari tabel vektor <code translate="no">table_1</code>. Tipe indeks (<code translate="no">engine_type</code>) dari file pertama adalah 1 (FLAT); status file (<code translate="no">file_type</code>) adalah 7 (cadangan dari file asli); <code translate="no">file_size</code> adalah 411200113 byte; jumlah baris vektor adalah 200.000. Jenis indeks file kedua adalah 2 (IVFLAT); status file adalah 3 (file indeks). File kedua sebenarnya adalah indeks dari file pertama. Kami akan memperkenalkan lebih banyak informasi dalam artikel mendatang.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>file tabel</span> </span></p>
<p>Tabel berikut ini menunjukkan bidang dan deskripsi dari <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Nama Field</th><th style="text-align:left">Tipe Data</th><th style="text-align:left">Deskripsi</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Pengenal unik dari tabel vektor. <code translate="no">id</code> bertambah secara otomatis.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nama tabel vektor.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Jenis indeks yang akan dibuat untuk tabel vektor. Standarnya adalah 0, yang menandakan indeks tidak valid. 1 menentukan FLAT. 2 menentukan IVFLAT. 3 menentukan IVFSQ8. 4 menentukan NSG. 5 menentukan IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nama file yang dihasilkan dari waktu pembuatan file. Sama dengan 1000 dikalikan dengan jumlah milidetik dari 1 Januari 1970 hingga saat tabel dibuat.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Status file. 0 menentukan file data vektor mentah yang baru dibuat. 1 menentukan file data vektor mentah. 2 menentukan bahwa indeks akan dibuat untuk file tersebut. 3 menentukan bahwa file tersebut adalah file indeks. 4 menentukan bahwa file akan dihapus (hapus lunak). 5 menentukan bahwa file tersebut baru dibuat dan digunakan untuk menyimpan data kombinasi. 6 menentukan bahwa file tersebut baru dibuat dan digunakan untuk menyimpan data indeks. 7 menentukan status pencadangan file data vektor mentah.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Ukuran file dalam byte.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Jumlah vektor dalam file.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Stempel waktu untuk waktu pembaruan terakhir, yang menentukan jumlah milidetik dari 1 Januari 1970 hingga saat tabel dibuat.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Jumlah milidetik dari 1 Januari 1970 hingga saat tabel dibuat.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Tanggal saat tabel dibuat. Ini masih ada di sini karena alasan historis dan akan dihapus di versi mendatang.</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">Blog terkait<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Mengelola Data dalam Mesin Pencari Vektor Skala Besar</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Manajemen Metadata Milvus (1): Cara Melihat Metadata</a></li>
</ul>
