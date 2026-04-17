---
id: 2019-12-18-datafile-cleanup.md
title: Strategi penghapusan sebelumnya dan masalah terkait
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: >-
  Kami telah meningkatkan strategi penghapusan file untuk memperbaiki masalah
  terkait operasi kueri.
cover: null
tag: Engineering
---
<custom-h1>Perbaikan Mekanisme Pembersihan File Data</custom-h1><blockquote>
<p>penulis Yihua Mo</p>
<p>Tanggal: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">Strategi penghapusan sebelumnya dan masalah terkait<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam <a href="/blog/id/2019-11-08-data-management.md">Mengelola Data di Mesin Pencari Vektor Skala Besar</a>, kami menyebutkan mekanisme penghapusan file data. Hapus termasuk hapus lunak dan hapus keras. Setelah melakukan operasi hapus pada sebuah tabel, tabel tersebut ditandai dengan hapus lunak. Operasi pencarian atau pembaruan setelah itu tidak lagi diperbolehkan. Namun, operasi kueri yang dimulai sebelum delete masih dapat berjalan. Tabel benar-benar dihapus bersama dengan metadata dan file lainnya hanya ketika operasi kueri selesai.</p>
<p>Jadi, kapan file yang ditandai dengan soft-delete benar-benar dihapus? Sebelum 0.6.0, strateginya adalah file benar-benar dihapus setelah soft-delete selama 5 menit. Gambar berikut ini menampilkan strategi tersebut:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5 menit</span> </span></p>
<p>Strategi ini didasarkan pada premis bahwa kueri biasanya tidak berlangsung lebih dari 5 menit dan tidak dapat diandalkan. Jika kueri berlangsung lebih dari 5 menit, kueri akan gagal. Alasannya adalah ketika kueri dimulai, Milvus mengumpulkan informasi tentang file yang dapat dicari dan membuat tugas kueri. Kemudian, penjadwal kueri memuat file ke memori satu per satu dan mencari file satu per satu. Jika file tidak lagi ada saat memuat file, kueri akan gagal.</p>
<p>Memperpanjang waktu dapat membantu mengurangi risiko kegagalan kueri, tetapi juga menyebabkan masalah lain: penggunaan disk terlalu besar. Alasannya adalah ketika sejumlah besar vektor dimasukkan, Milvus terus menggabungkan file data dan file gabungan tidak segera dihapus dari disk, meskipun tidak ada kueri yang terjadi. Jika penyisipan data terlalu cepat dan/atau jumlah data yang disisipkan terlalu besar, penggunaan disk tambahan dapat mencapai puluhan GB. Lihat gambar berikut ini sebagai contoh:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>hasil</span> </span></p>
<p>Seperti yang ditunjukkan pada gambar sebelumnya, kumpulan data pertama yang disisipkan (insert_1) dibuang ke disk dan menjadi file_1, kemudian insert_2 menjadi file_2. Thread yang bertanggung jawab atas kombinasi file menggabungkan file-file tersebut menjadi file_3. Kemudian, file_1 dan file_2 ditandai sebagai soft-delete. Kumpulan data sisipan ketiga menjadi file_4. Thread menggabungkan file_3 dan file_4 ke file_5 dan menandai file_3 dan file_4 sebagai soft-delete.</p>
<p>Demikian juga, insert_6 dan insert_5 digabungkan. Pada t3, file_5 dan file_6 ditandai sebagai soft-delete. Antara t3 dan t4, meskipun banyak file yang ditandai sebagai soft-delete, file-file tersebut masih ada di dalam disk. File benar-benar dihapus setelah t4. Jadi, antara t3 dan t4, penggunaan disk adalah 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB. Data yang disisipkan adalah 64 + 64 + 64 + 64 = 256 MB. Penggunaan disk adalah 3 kali ukuran data yang dimasukkan. Semakin cepat kecepatan tulis disk, semakin tinggi penggunaan disk selama periode waktu tertentu.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">Perbaikan strategi penghapusan di 0.6.0<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>Oleh karena itu, kami mengubah strategi untuk menghapus file di v0.6.0. Penghapusan keras tidak lagi menggunakan waktu sebagai pemicu. Sebagai gantinya, pemicunya adalah ketika file tidak digunakan oleh tugas apa pun.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>strategi baru</span> </span></p>
<p>Asumsikan dua kumpulan vektor dimasukkan. Pada t1 permintaan kueri diberikan, Milvus mendapatkan dua berkas yang akan di-query (berkas_1 dan berkas_2, karena berkas_3 masih belum ada). Kemudian, thread backend mulai menggabungkan kedua berkas tersebut dengan kueri yang berjalan pada waktu yang sama. Ketika file_3 dihasilkan, file_1 dan file_2 ditandai sebagai soft-delete. Setelah kueri, tidak ada tugas lain yang akan menggunakan file_1 dan file_2, sehingga keduanya akan dihapus secara keras pada t4. Interval antara t2 dan t4 sangat kecil dan tergantung pada interval kueri. Dengan cara ini, berkas yang tidak terpakai akan dihapus pada waktunya.</p>
<p>Untuk implementasi internal, penghitungan referensi, yang sudah tidak asing lagi bagi para insinyur perangkat lunak, digunakan untuk menentukan apakah sebuah file dapat dihapus secara keras. Untuk menjelaskan dengan menggunakan perbandingan, ketika seorang pemain memiliki nyawa dalam sebuah permainan, dia masih bisa bermain. Ketika jumlah nyawa menjadi 0, permainan berakhir. Milvus memonitor status setiap file. Ketika sebuah file digunakan oleh sebuah tugas, sebuah nyawa akan ditambahkan ke file tersebut. Ketika file tidak lagi digunakan, satu nyawa akan dihapus dari file tersebut. Ketika sebuah file ditandai dengan hapus lunak dan jumlah nyawa adalah 0, file tersebut siap untuk dihapus secara keras.</p>
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
<li><a href="/blog/id/2019-11-08-data-management.md">Mengelola Data di Mesin Pencari Vektor Berskala Besar</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Manajemen Metadata Milvus (1): Cara Melihat Metadata</a></li>
<li><a href="/blog/id/2019-12-27-meta-table.md">Manajemen Metadata Milvus (2): Kolom-kolom dalam Tabel Metadata</a></li>
</ul>
