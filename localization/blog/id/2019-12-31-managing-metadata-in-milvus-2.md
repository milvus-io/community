---
id: managing-metadata-in-milvus-2.md
title: Bidang-bidang dalam tabel Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Bidang dalam Tabel Metadata
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Manajemen Metadata Milvus (2)</custom-h1><p>Di blog sebelumnya, kami telah membahas cara melihat metadata menggunakan MySQL atau SQLite. Artikel ini terutama bermaksud untuk memperkenalkan secara rinci bidang-bidang dalam tabel metadata.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Bidang-bidang dalam tabel <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Ambil SQLite sebagai contoh. Hasil berikut ini berasal dari 0.5.0. Beberapa field ditambahkan ke 0.6.0, yang akan diperkenalkan nanti. Ada sebuah baris di <code translate="no">Tables</code> yang menetapkan tabel vektor 512 dimensi dengan nama &lt;codetable_1</code>. Ketika tabel dibuat, <code translate="no">index_file_size</code> adalah 1024 MB, <code translate="no">engine_type</code> adalah 1 (FLAT), <code translate="no">nlist</code> adalah 16384, <code translate="no">metric_type</code> adalah 1 (jarak Euclidean L2). id adalah pengenal unik dari tabel. <code translate="no">state</code> adalah status tabel dengan angka 0 yang mengindikasikan status normal. <code translate="no">created_on</code> adalah waktu pembuatan. <code translate="no">flag</code> adalah flag yang disediakan untuk penggunaan internal.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>Tabel berikut ini menunjukkan jenis bidang dan deskripsi bidang di <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-jenis-bidang-deskripsi-milvus-metadata.png</span> </span></p>
<p>Partisi tabel diaktifkan di 0.6.0 dengan beberapa bidang baru, termasuk <code translate="no">owner_table</code>,<code translate="no">partition_tag</code> dan <code translate="no">version</code>. Sebuah tabel vektor, <code translate="no">table_1</code>, memiliki sebuah partisi yang disebut <code translate="no">table_1_p1</code>, yang juga merupakan sebuah tabel vektor. <code translate="no">partition_name</code> berhubungan dengan <code translate="no">table_id</code>. Bidang dalam tabel partisi diwarisi dari <code translate="no">owner table</code>, dengan bidang tabel pemilik yang menentukan nama tabel pemilik dan bidang <code translate="no">partition_tag</code> menentukan tag partisi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-gambar-2.png</span> </span></p>
<p>Tabel berikut ini menunjukkan bidang-bidang baru di 0.6.0:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-bidang-baru-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Bidang-bidang dalam tabel TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Contoh berikut ini berisi dua berkas, yang keduanya merupakan bagian dari tabel vektor <code translate="no">table_1</code>. Tipe indeks (<code translate="no">engine_type</code>) dari file pertama adalah 1 (FLAT); status file (<code translate="no">file_type</code>) adalah 7 (cadangan dari file asli); <code translate="no">file_size</code> adalah 411200113 byte; jumlah baris vektor adalah 200.000. Jenis indeks file kedua adalah 2 (IVFLAT); status file adalah 3 (file indeks). File kedua sebenarnya adalah indeks dari file pertama. Kami akan memperkenalkan lebih banyak informasi di artikel mendatang.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-gambar-3.png</span> </span></p>
<p>Tabel berikut ini menunjukkan bidang dan deskripsi dari <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-jenis-bidang-deskripsi-tabelfile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Apa yang akan datang berikutnya<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Artikel yang akan datang akan menunjukkan kepada Anda bagaimana cara menggunakan SQLite untuk mengelola metadata di Milvus. Nantikan!</p>
<p>Jika ada pertanyaan, selamat datang untuk bergabung dengan <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">saluran Slack</a>kami <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">atau</a>mengajukan masalah di repo.</p>
<p>Repositori GitHub: https://github.com/milvus-io/milvus</p>
