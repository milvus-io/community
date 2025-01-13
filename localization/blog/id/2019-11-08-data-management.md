---
id: 2019-11-08-data-management.md
title: Bagaimana manajemen data dilakukan di Milvus
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: Posting ini memperkenalkan strategi manajemen data di Milvus.
cover: null
tag: Engineering
origin: null
---
<custom-h1>Mengelola Data dalam Mesin Pencari Vektor Berskala Besar</custom-h1><blockquote>
<p>Penulis Yihua Mo</p>
<p>Tanggal: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Bagaimana manajemen data dilakukan di Milvus<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertama-tama, beberapa konsep dasar Milvus:</p>
<ul>
<li>Tabel: Tabel adalah sekumpulan data vektor, dengan setiap vektor memiliki ID yang unik. Setiap vektor dan ID-nya merepresentasikan sebuah baris dari tabel. Semua vektor dalam tabel harus memiliki dimensi yang sama. Di bawah ini adalah contoh tabel dengan vektor 10 dimensi:</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>tabel</span> </span></p>
<ul>
<li>Indeks: Membangun indeks adalah proses pengelompokan vektor dengan algoritme tertentu, yang membutuhkan ruang disk tambahan. Beberapa jenis indeks membutuhkan lebih sedikit ruang karena mereka menyederhanakan dan memampatkan vektor, sementara beberapa jenis lainnya membutuhkan lebih banyak ruang daripada vektor mentah.</li>
</ul>
<p>Dalam Milvus, pengguna dapat melakukan tugas-tugas seperti membuat tabel, menyisipkan vektor, membuat indeks, mencari vektor, mengambil informasi tabel, menghapus tabel, menghapus sebagian data dalam tabel, dan menghapus indeks, dll.</p>
<p>Anggaplah kita memiliki 100 juta vektor 512 dimensi, dan perlu menyisipkan dan mengelolanya di Milvus untuk pencarian vektor yang efisien.</p>
<p><strong>(1) Memasukkan Vektor</strong></p>
<p>Mari kita lihat bagaimana vektor dimasukkan ke dalam Milvus.</p>
<p>Karena setiap vektor membutuhkan ruang 2 KB, maka ruang penyimpanan minimum untuk 100 juta vektor adalah sekitar 200 GB, yang membuat penyisipan semua vektor ini menjadi tidak realistis. Harus ada beberapa file data, bukan hanya satu. Performa penyisipan adalah salah satu indikator kinerja utama. Milvus mendukung penyisipan ratusan atau bahkan puluhan ribu vektor dalam satu kali penyisipan. Sebagai contoh, satu kali penyisipan 30 ribu vektor 512 dimensi umumnya hanya membutuhkan waktu 1 detik.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>menyisipkan</span> </span></p>
<p>Tidak semua penyisipan vektor dimasukkan ke dalam disk. Milvus menyediakan sebuah buffer yang dapat berubah-ubah dalam memori CPU untuk setiap tabel yang dibuat, dimana data yang disisipkan dapat dengan cepat ditulis. Dan ketika data dalam buffer yang dapat berubah mencapai ukuran tertentu, ruang ini akan diberi label sebagai tidak dapat diubah. Sementara itu, buffer baru yang dapat diubah akan dicadangkan. Data dalam buffer yang tidak dapat diubah ditulis ke disk secara teratur dan memori CPU yang sesuai akan dikosongkan. Mekanisme penulisan reguler ke disk mirip dengan mekanisme yang digunakan pada Elasticsearch, yang menulis data buffer ke disk setiap 1 detik. Sebagai tambahan, pengguna yang terbiasa dengan LevelDB/RocksDB dapat melihat kemiripan dengan MemTable di sini.</p>
<p>Tujuan dari mekanisme Penyisipan Data adalah:</p>
<ul>
<li>Penyisipan data harus efisien.</li>
<li>Data yang disisipkan dapat digunakan secara instan.</li>
<li>File data tidak boleh terlalu terfragmentasi.</li>
</ul>
<p><strong>(2) File Data Mentah</strong></p>
<p>Ketika vektor ditulis ke disk, vektor disimpan dalam File Data Mentah yang berisi vektor mentah. Seperti yang telah disebutkan sebelumnya, vektor berskala besar perlu disimpan dan dikelola dalam beberapa file data. Ukuran data yang dimasukkan bervariasi karena pengguna dapat memasukkan 10 vektor, atau 1 juta vektor sekaligus. Namun, operasi penulisan ke disk dijalankan setiap 1 detik sekali. Dengan demikian, file data dengan ukuran yang berbeda dihasilkan.</p>
<p>File data yang terfragmentasi tidak nyaman untuk dikelola dan tidak mudah diakses untuk pencarian vektor. Milvus secara konstan menggabungkan file-file data kecil ini hingga ukuran file yang digabungkan mencapai ukuran tertentu, misalnya, 1GB. Ukuran tertentu ini dapat dikonfigurasi dalam parameter API <code translate="no">index_file_size</code> dalam pembuatan tabel. Oleh karena itu, 100 juta vektor 512 dimensi akan didistribusikan dan disimpan dalam sekitar 200 file data.</p>
<p>Dengan mempertimbangkan skenario komputasi tambahan, di mana vektor dimasukkan dan dicari secara bersamaan, kita perlu memastikan bahwa setelah vektor ditulis ke disk, vektor tersebut tersedia untuk pencarian. Dengan demikian, sebelum file data kecil digabungkan, file-file tersebut dapat diakses dan dicari. Setelah penggabungan selesai, file data kecil akan dihapus, dan file yang baru digabungkan akan digunakan untuk pencarian.</p>
<p>Berikut ini adalah tampilan file yang ditanyakan sebelum penggabungan:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>File yang ditanyakan setelah penggabungan:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) File Indeks</strong></p>
<p>Pencarian berdasarkan File Data Mentah adalah pencarian brute-force yang membandingkan jarak antara vektor kueri dan vektor asal, dan menghitung k vektor terdekat. Pencarian brute-force tidak efisien. Efisiensi pencarian dapat sangat ditingkatkan jika pencarian didasarkan pada File Indeks di mana vektor-vektor diindeks. Membangun indeks membutuhkan ruang disk tambahan dan biasanya memakan waktu.</p>
<p>Jadi, apa perbedaan antara File Data Mentah dan File Indeks? Sederhananya, File Data Mentah mencatat setiap vektor bersama dengan ID uniknya, sedangkan File Indeks mencatat hasil pengelompokan vektor seperti jenis indeks, pusat klaster, dan vektor di setiap klaster.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>file indeks</span> </span></p>
<p>Secara umum, File Indeks berisi lebih banyak informasi daripada File Data Mentah, namun ukuran file jauh lebih kecil karena vektor disederhanakan dan dikuantifikasi selama proses pembuatan indeks (untuk jenis indeks tertentu).</p>
<p>Tabel yang baru dibuat secara default dicari dengan komputasi brute. Setelah indeks dibuat dalam sistem, Milvus akan secara otomatis membangun indeks untuk berkas gabungan yang mencapai ukuran 1 GB dalam sebuah thread mandiri. Ketika pembuatan indeks selesai, sebuah File Indeks baru akan dibuat. File data mentah akan diarsipkan untuk pembangunan indeks berdasarkan jenis indeks lainnya.</p>
<p>Milvus secara otomatis membangun indeks untuk file yang mencapai 1 GB:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>Pembuatan indeks selesai:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>Indeks tidak akan dibangun secara otomatis untuk berkas data mentah yang tidak mencapai 1 GB, yang dapat memperlambat kecepatan pencarian. Untuk menghindari situasi ini, Anda perlu melakukan pembangunan indeks secara manual untuk tabel ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>forcebuild</span> </span></p>
<p>Setelah indeks dibuat secara paksa untuk berkas, kinerja pencarian akan meningkat pesat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) Meta Data</strong></p>
<p>Seperti yang telah disebutkan sebelumnya, 100 juta vektor 512 dimensi disimpan dalam 200 file disk. Ketika indeks dibuat untuk vektor-vektor ini, akan ada 200 berkas indeks tambahan, yang membuat jumlah total berkas menjadi 400 (termasuk berkas disk dan berkas indeks). Mekanisme yang efisien diperlukan untuk mengelola meta data (status file dan informasi lainnya) dari file-file ini untuk memeriksa status file, menghapus atau membuat file.</p>
<p>Menggunakan basis data OLTP untuk mengelola informasi ini adalah pilihan yang baik. Milvus yang berdiri sendiri menggunakan SQLite untuk mengelola meta data sementara dalam penyebaran terdistribusi, Milvus menggunakan MySQL. Ketika server Milvus dimulai, 2 tabel (yaitu 'Tables' dan 'TableFiles') dibuat di SQLite/MySQL. 'Tables' mencatat informasi tabel dan 'TableFiles' mencatat informasi file data dan file indeks.</p>
<p>Seperti yang ditunjukkan pada diagram alir di bawah ini, 'Tables' berisi informasi meta data seperti nama tabel (table_id), dimensi vektor (dimension), tanggal pembuatan tabel (created_on), status tabel (state), jenis indeks (engine_type), dan jumlah cluster vektor (nlist) serta metode penghitungan jarak (metric_type).</p>
<p>Dan 'TableFiles' berisi nama tabel tempat file berada (table_id), jenis indeks file (engine_type), nama file (file_id), jenis file (file_type), ukuran file (file_size), jumlah baris (row_count), dan tanggal pembuatan file (created_on).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>metadata</span> </span></p>
<p>Dengan meta data ini, berbagai operasi dapat dijalankan. Berikut ini adalah beberapa contohnya:</p>
<ul>
<li>Untuk membuat sebuah tabel, Meta Manager hanya perlu mengeksekusi pernyataan SQL: <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>Untuk mengeksekusi pencarian vektor pada tabel_2, Meta Manager akan mengeksekusi sebuah query di SQLite/MySQL, yang merupakan sebuah pernyataan SQL de facto: <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> untuk mengambil informasi file dari tabel_2. Kemudian file-file ini akan dimuat ke dalam memori oleh Penjadwal Kueri untuk perhitungan pencarian.</li>
<li>Tidak diperbolehkan untuk menghapus tabel secara instan karena mungkin ada kueri yang sedang dieksekusi di dalamnya. Itulah mengapa ada penghapusan lunak dan penghapusan keras untuk sebuah tabel. Ketika Anda menghapus sebuah tabel, tabel tersebut akan diberi label 'soft-delete', dan tidak ada kueri atau perubahan lebih lanjut yang diizinkan untuk dilakukan pada tabel tersebut. Namun, kueri yang sedang berjalan sebelum penghapusan masih tetap berjalan. Hanya ketika semua kueri pra-penghapusan ini selesai, tabel, bersama dengan meta data dan file terkait, akan dihapus untuk selamanya.</li>
</ul>
<p><strong>(5) Penjadwal Kueri</strong></p>
<p>Bagan di bawah ini menunjukkan proses pencarian vektor di CPU dan GPU dengan melakukan kueri pada file (file data mentah dan file indeks) yang disalin dan disimpan di disk, memori CPU dan memori GPU untuk vektor yang paling mirip dengan topk.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkresult</span> </span></p>
<p>Algoritma penjadwalan kueri secara signifikan meningkatkan kinerja sistem. Filosofi desain dasar adalah untuk mencapai kinerja pencarian terbaik melalui pemanfaatan sumber daya perangkat keras secara maksimal. Di bawah ini adalah penjelasan singkat tentang penjadwal kueri dan akan ada artikel khusus tentang topik ini di masa mendatang.</p>
<p>Kami menyebut kueri pertama terhadap tabel yang diberikan sebagai kueri 'dingin', dan kueri berikutnya sebagai kueri 'hangat'. Ketika kueri pertama dibuat terhadap tabel yang diberikan, Milvus melakukan banyak pekerjaan untuk memuat data ke dalam memori CPU, dan beberapa data ke dalam memori GPU, yang memakan waktu. Pada kueri selanjutnya, pencarian jauh lebih cepat karena sebagian atau semua data sudah berada di memori CPU sehingga menghemat waktu untuk membaca dari disk.</p>
<p>Untuk mempersingkat waktu pencarian query pertama, Milvus menyediakan konfigurasi Preload Table (<code translate="no">preload_table</code>) yang memungkinkan pemuatan tabel secara otomatis ke dalam memori CPU pada saat server dinyalakan. Untuk tabel yang berisi 100 juta vektor 512 dimensi, yang berukuran 200 GB, kecepatan pencarian akan menjadi yang tercepat jika ada cukup memori CPU untuk menyimpan semua data ini. Namun, jika tabel berisi vektor berskala miliaran, terkadang tidak dapat dihindari untuk mengosongkan memori CPU/GPU untuk menambahkan data baru yang tidak ditanyakan. Saat ini, kami menggunakan LRU (Latest Recently Used) sebagai strategi penggantian data.</p>
<p>Seperti yang ditunjukkan pada bagan di bawah ini, asumsikan ada sebuah tabel yang memiliki 6 file indeks yang tersimpan di dalam disk. Memori CPU hanya dapat menyimpan 3 berkas indeks, dan memori GPU hanya 1 berkas indeks.</p>
<p>Ketika pencarian dimulai, 3 file indeks akan dimuat ke dalam memori CPU untuk query. File pertama akan dilepaskan dari memori CPU segera setelah query dilakukan. Sementara itu, file ke-4 dimuat ke dalam memori CPU. Dengan cara yang sama, ketika sebuah file di-query di memori GPU, file tersebut akan langsung dilepaskan dan digantikan dengan file baru.</p>
<p>Penjadwal kueri terutama menangani 2 set antrian tugas, satu antrian tentang pemuatan data dan satu lagi tentang eksekusi pencarian.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>jadwal kueri</span> </span></p>
<p><strong>(6) Pengurang Hasil</strong></p>
<p>Ada 2 parameter kunci yang terkait dengan pencarian vektor: satu adalah 'n' yang berarti n jumlah vektor target; satu lagi adalah 'k' yang berarti k vektor yang paling mirip. Hasil pencarian sebenarnya adalah n set KVP (pasangan nilai-kunci), masing-masing memiliki k pasangan nilai-kunci. Karena kueri perlu dieksekusi terhadap setiap file, baik itu file data mentah maupun file indeks, maka n set dari k set hasil teratas akan diambil untuk setiap file. Semua set hasil ini digabungkan untuk mendapatkan set hasil top-k dari tabel.</p>
<p>Contoh di bawah ini menunjukkan bagaimana kumpulan hasil digabungkan dan dikurangi untuk pencarian vektor terhadap tabel dengan 4 file indeks (n = 2, k = 3). Perhatikan bahwa setiap set hasil memiliki 2 kolom. Kolom kiri mewakili id vektor dan kolom kanan mewakili jarak Euclidean.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>hasil</span> </span></p>
<p><strong>(7) Pengoptimalan di Masa Depan</strong></p>
<p>Berikut ini adalah beberapa pemikiran tentang kemungkinan optimasi manajemen data.</p>
<ul>
<li>Bagaimana jika data dalam buffer yang tidak dapat diubah atau bahkan buffer yang dapat diubah juga dapat langsung di-query? Saat ini, data dalam buffer yang tidak dapat diubah tidak dapat di-query, tidak sampai data tersebut ditulis ke disk. Beberapa pengguna lebih tertarik pada akses data seketika setelah penyisipan.</li>
<li>Menyediakan fungsionalitas partisi tabel yang memungkinkan pengguna untuk membagi tabel yang sangat besar menjadi partisi yang lebih kecil, dan menjalankan pencarian vektor terhadap partisi yang diberikan.</li>
<li>Menambahkan beberapa atribut yang dapat difilter pada vektor. Sebagai contoh, beberapa pengguna hanya ingin mencari di antara vektor-vektor dengan atribut tertentu. Hal ini diperlukan untuk mengambil atribut vektor dan bahkan vektor mentah. Salah satu pendekatan yang memungkinkan adalah dengan menggunakan basis data KV seperti RocksDB.</li>
<li>Menyediakan fungsionalitas migrasi data yang memungkinkan migrasi otomatis data yang sudah ketinggalan zaman ke ruang penyimpanan lain. Untuk beberapa skenario di mana data mengalir setiap saat, data mungkin akan menua. Karena beberapa pengguna hanya peduli dan melakukan pencarian terhadap data bulan terakhir, data yang lebih tua menjadi kurang berguna namun menghabiskan banyak ruang disk. Mekanisme migrasi data membantu mengosongkan ruang disk untuk data baru.</li>
</ul>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Artikel ini terutama memperkenalkan strategi manajemen data di Milvus. Artikel lain tentang penyebaran terdistribusi Milvus, pemilihan metode pengindeksan vektor, dan penjadwal kueri akan segera hadir. Nantikan terus!</p>
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Manajemen Metadata Milvus (1): Cara Melihat Metadata</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Manajemen Metadata Milvus (2): Kolom-kolom dalam Tabel Metadata</a></li>
</ul>
