---
id: deleting-data-in-milvus.md
title: Penutup
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: >-
  Dalam Milvus v0.7.0 kami membuat desain baru untuk membuat penghapusan menjadi
  lebih efisien dan mendukung lebih banyak jenis indeks.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Bagaimana Milvus Menerapkan Fungsi Hapus</custom-h1><p>Artikel ini membahas bagaimana Milvus mengimplementasikan fungsi hapus. Sebagai sebuah fitur yang sangat dinanti-nantikan oleh banyak pengguna, fungsi hapus telah diperkenalkan pada Milvus v0.7.0. Kami tidak memanggil fungsi hapus_id di FAISS secara langsung, namun kami membuat desain baru untuk membuat penghapusan menjadi lebih efisien dan mendukung lebih banyak jenis indeks.</p>
<p>Dalam artikel <a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">Bagaimana Milvus Merealisasikan Pembaruan dan Kueri Data Dinamis</a>, kami memperkenalkan seluruh proses dari memasukkan data hingga pembilasan data. Mari kita ulas kembali beberapa hal yang mendasar. MemManager mengelola semua buffer penyisipan, dengan setiap MemTable yang berhubungan dengan sebuah koleksi (kami mengganti nama "tabel" menjadi "koleksi" di Milvus v0.7.0). Milvus secara otomatis membagi data yang dimasukkan ke dalam memori ke dalam beberapa MemTableFiles. Ketika data di-flash ke disk, setiap MemTableFile diserialisasi menjadi sebuah file mentah. Kami mempertahankan arsitektur ini ketika merancang fungsi hapus.</p>
<p>Kami mendefinisikan fungsi metode hapus sebagai menghapus semua data yang berhubungan dengan ID entitas tertentu dalam koleksi tertentu. Ketika mengembangkan fungsi ini, kami merancang dua skenario. Yang pertama adalah menghapus data yang masih ada di buffer sisipan, dan yang kedua adalah menghapus data yang telah di-flash ke disk. Skenario pertama lebih intuitif. Kita dapat menemukan MemTableFile yang sesuai dengan ID yang ditentukan, dan menghapus data dalam memori secara langsung (Gambar 1). Karena penghapusan dan penyisipan data tidak dapat dilakukan pada saat yang sama, dan karena mekanisme yang mengubah MemTableFile dari berubah menjadi tidak dapat diubah ketika mem-flash data, penghapusan hanya dilakukan di buffer yang dapat diubah. Dengan cara ini, operasi penghapusan tidak berbenturan dengan pembilasan data, sehingga memastikan konsistensi data.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-permintaan-penghapusan-milvus.jpg</span> </span></p>
<p>Skenario kedua lebih kompleks tetapi lebih umum, karena pada kebanyakan kasus, data tetap berada dalam buffer sisipan sebentar sebelum di-flush ke disk. Karena sangat tidak efisien untuk memuat data yang dibilas ke memori untuk penghapusan keras, kami memutuskan untuk melakukan penghapusan lunak, pendekatan yang lebih efisien. Alih-alih menghapus data yang dibuang, penghapusan lunak menyimpan ID yang dihapus dalam file terpisah. Dengan cara ini, kita dapat menyaring ID yang dihapus tersebut selama operasi pembacaan, seperti pencarian.</p>
<p>Dalam hal implementasi, ada beberapa hal yang perlu dipertimbangkan. Di Milvus, data dapat dilihat atau, dengan kata lain, dapat dipulihkan, hanya jika data tersebut di-flush ke disk. Oleh karena itu, data yang di-flush tidak dihapus selama pemanggilan metode delete, tetapi pada operasi flush berikutnya. Alasannya adalah file data yang telah di-flush ke disk tidak lagi menyertakan data baru, sehingga penghapusan lunak tidak berdampak pada data yang telah di-flush. Saat memanggil delete, Anda dapat langsung menghapus data yang masih ada di insert buffer, sedangkan untuk data yang di-flush, Anda perlu mencatat ID data yang dihapus di memori. Ketika melakukan flushing data ke disk, Milvus menulis ID yang dihapus ke file DEL untuk mencatat entitas mana dalam segmen yang sesuai yang dihapus. Pembaruan ini hanya akan terlihat setelah pembilasan data selesai. Proses ini diilustrasikan pada Gambar 2. Sebelum v0.7.0, kami hanya memiliki mekanisme pembilasan otomatis; yaitu, Milvus menserialisasikan data dalam buffer sisipan setiap detik. Pada desain baru kami, kami menambahkan metode flush yang memungkinkan pengembang untuk memanggil setelah metode hapus, memastikan bahwa data yang baru disisipkan terlihat dan data yang dihapus tidak lagi dapat dipulihkan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-hapus-permintaan-milvus.jpg</span> </span></p>
<p>Masalah kedua adalah bahwa file data mentah dan file indeks adalah dua file terpisah dalam Milvus, dan dua catatan independen dalam metadata. Ketika menghapus ID tertentu, kita perlu menemukan file mentah dan file indeks yang sesuai dengan ID tersebut dan mencatatnya bersama-sama. Oleh karena itu, kami memperkenalkan konsep segmen. Segmen berisi berkas mentah (yang mencakup berkas vektor mentah dan berkas ID), berkas indeks, dan berkas DEL. Segmen adalah unit paling dasar untuk membaca, menulis, dan mencari vektor di Milvus. Sebuah koleksi (Gambar 3) terdiri dari beberapa segmen. Dengan demikian, ada beberapa folder segmen di bawah sebuah folder koleksi di dalam disk. Karena metadata kami didasarkan pada basis data relasional (SQLite atau MySQL), maka sangat mudah untuk mencatat hubungan dalam sebuah segmen, dan operasi penghapusan tidak lagi memerlukan pemrosesan terpisah dari berkas mentah dan berkas indeks.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-hapus-permintaan-milvus.jpg</span> </span></p>
<p>Masalah ketiga adalah bagaimana menyaring data yang dihapus selama pencarian. Dalam praktiknya, ID yang direkam oleh DEL adalah offset dari data yang sesuai yang disimpan dalam segmen. Karena segmen yang dibuang tidak menyertakan data baru, maka offset tidak akan berubah. Struktur data DEL adalah bitmap dalam memori, di mana bit yang aktif mewakili offset yang dihapus. Kami juga memperbarui FAISS dengan cara yang sama: ketika Anda mencari di FAISS, vektor yang berhubungan dengan bit aktif tidak akan lagi disertakan dalam perhitungan jarak (Gambar 4). Perubahan pada FAISS tidak akan dibahas secara rinci di sini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-hapus-permintaan-milvus.jpg</span> </span></p>
<p>Isu terakhir adalah tentang peningkatan kinerja. Ketika menghapus data yang dibuang, pertama-tama Anda harus mencari tahu di segmen mana dari koleksi yang mana ID yang dihapus berada dan kemudian mencatat offsetnya. Pendekatan yang paling mudah adalah mencari semua ID di setiap segmen. Pengoptimalan yang kami pikirkan adalah menambahkan filter mekar ke setiap segmen. Bloom filter adalah struktur data acak yang digunakan untuk memeriksa apakah sebuah elemen adalah anggota dari sebuah himpunan. Oleh karena itu, kita hanya dapat memuat filter bloom dari setiap segmen. Hanya ketika bloom filter menentukan bahwa ID yang dihapus berada di segmen saat ini, kita dapat menemukan offset yang sesuai di segmen tersebut; jika tidak, kita dapat mengabaikan segmen ini (Gambar 5). Kami memilih bloom filter karena filter ini menggunakan lebih sedikit ruang dan lebih efisien dalam pencarian dibandingkan dengan kebanyakan filter lainnya, seperti tabel hash. Meskipun bloom filter memiliki tingkat positif palsu tertentu, kita dapat mengurangi segmen yang perlu dicari ke jumlah yang ideal untuk menyesuaikan probabilitas. Sementara itu, bloom filter juga perlu mendukung penghapusan. Jika tidak, ID entitas yang dihapus masih dapat ditemukan di filter bloom, sehingga tingkat false-positive meningkat. Untuk alasan ini, kami menggunakan filter counting bloom karena mendukung penghapusan. Dalam artikel ini, kami tidak akan menjelaskan cara kerja filter bloom. Anda dapat merujuk ke Wikipedia jika Anda tertarik.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-permintaan-hapus-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">Penutup<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>Sejauh ini, kami telah memberikan Anda pengantar singkat tentang bagaimana Milvus menghapus vektor berdasarkan ID. Seperti yang Anda ketahui, kita menggunakan penghapusan lunak untuk menghapus data yang telah dibilas. Saat data yang dihapus bertambah, kita perlu memadatkan segmen-segmen dalam koleksi untuk membebaskan ruang yang ditempati oleh data yang dihapus. Selain itu, jika sebuah segmen telah diindeks, pemadatan juga menghapus file indeks sebelumnya dan membuat indeks baru. Untuk saat ini, pengembang perlu memanggil metode compact untuk memadatkan data. Ke depannya, kami berharap dapat memperkenalkan mekanisme pemeriksaan. Sebagai contoh, ketika jumlah data yang dihapus mencapai ambang batas tertentu atau distribusi data telah berubah setelah penghapusan, Milvus secara otomatis memadatkan segmen.</p>
<p>Sekarang kami telah memperkenalkan filosofi desain di balik fungsi hapus dan implementasinya. Pasti masih ada ruang untuk perbaikan, dan setiap komentar atau saran Anda sangat diharapkan.</p>
<p>Ketahui lebih lanjut tentang Milvus: https://github.com/milvus-io/milvus. Anda juga bisa bergabung dengan komunitas kami <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">, Slack</a> untuk diskusi teknis!</p>
