---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: Memilih basis data vektor untuk pencarian ANN di Reddit
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: >-
  Posting ini menjelaskan proses yang digunakan tim Reddit untuk memilih basis
  data vektor yang paling sesuai dan mengapa mereka memilih Milvus.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>Artikel ini ditulis oleh Chris Fournie, Staf Insinyur Perangkat Lunak di Reddit, dan awalnya diterbitkan di</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a>, dan diposting ulang di sini dengan izin.</p>
<p>Pada tahun 2024, tim Reddit menggunakan berbagai solusi untuk melakukan pencarian vektor dengan perkiraan tetangga terdekat (ANN). Mulai dari <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">Vertex AI Vector Search</a> milik Google dan bereksperimen dengan menggunakan <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">pencarian vektor ANN Apache Solr</a> untuk beberapa set data yang lebih besar, hingga <a href="https://github.com/facebookresearch/faiss">perpustakaan FAISS</a> milik Facebook untuk set data yang lebih kecil (di-host di side-cars yang diskalakan secara vertikal). Semakin banyak tim di Reddit yang menginginkan solusi pencarian vektor ANN yang didukung secara luas yang hemat biaya, memiliki fitur pencarian yang mereka inginkan, dan dapat diskalakan ke data seukuran Reddit. Untuk memenuhi kebutuhan ini, pada tahun 2025, kami mencari basis data vektor yang ideal untuk tim Reddit.</p>
<p>Tulisan ini menjelaskan proses yang kami gunakan untuk memilih database vektor terbaik untuk kebutuhan Reddit saat ini. Ini tidak menjelaskan database vektor terbaik secara keseluruhan, atau serangkaian persyaratan fungsional dan non-fungsional yang paling penting untuk semua situasi. Ini menjelaskan apa yang dihargai dan diprioritaskan oleh Reddit dan budaya tekniknya ketika memilih database vektor. Tulisan ini dapat menjadi inspirasi untuk pengumpulan dan evaluasi kebutuhan Anda sendiri, tetapi setiap organisasi memiliki budaya, nilai, dan kebutuhannya sendiri.</p>
<h2 id="Evaluation-process" class="common-anchor-header">Proses evaluasi<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>Secara keseluruhan, langkah-langkah pemilihannya adalah:</p>
<p>1. Mengumpulkan konteks dari tim</p>
<p>2. Mengevaluasi solusi secara kualitatif</p>
<p>3. Mengevaluasi pesaing utama secara kuantitatif</p>
<p>4. Seleksi akhir</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. Mengumpulkan konteks dari tim</h3><p>Tiga buah konteks dikumpulkan dari tim yang tertarik untuk melakukan pencarian vektor ANN:</p>
<ul>
<li><p>Persyaratan fungsional (misalnya, Pencarian vektor hibrida dan leksikal? Kueri penelusuran rentang? Pemfilteran berdasarkan atribut non-vektor?)</p></li>
<li><p>Persyaratan non-fungsional (misalnya, Dapatkah mendukung vektor 1B? Dapatkah mencapai latensi P99 &lt;100ms?)</p></li>
<li><p>Tim basis data vektor sudah tertarik pada</p></li>
</ul>
<p>Mewawancarai tim untuk mendapatkan persyaratan bukanlah hal yang sepele. Banyak yang akan menjelaskan kebutuhan mereka dalam hal bagaimana mereka saat ini menyelesaikan masalah, dan tantangan Anda adalah memahami dan menghilangkan bias tersebut.</p>
<p>Sebagai contoh, sebuah tim sudah menggunakan FAISS untuk pencarian vektor ANN dan menyatakan bahwa solusi baru harus secara efisien mengembalikan 10 ribu hasil per panggilan pencarian. Setelah berdiskusi lebih lanjut, alasan dari 10K hasil tersebut adalah karena mereka perlu melakukan pemfilteran post-hoc, dan FAISS tidak menawarkan pemfilteran hasil ANN pada waktu kueri. Masalah mereka yang sebenarnya adalah bahwa mereka membutuhkan penyaringan, sehingga solusi apa pun yang menawarkan penyaringan yang efisien sudah cukup, dan mengembalikan hasil 10K hanyalah sebuah solusi yang diperlukan untuk meningkatkan daya ingat mereka. Idealnya, mereka ingin menyaring seluruh koleksi sebelum menemukan tetangga terdekat.</p>
<p>Meminta database vektor yang sudah digunakan atau diminati oleh tim juga merupakan hal yang berharga. Jika setidaknya satu tim memiliki pandangan positif tentang solusi mereka saat ini, itu adalah tanda bahwa database vektor dapat menjadi solusi yang berguna untuk dibagikan ke seluruh perusahaan. Jika tim hanya memiliki pandangan negatif terhadap suatu solusi, maka kita tidak boleh memasukkannya sebagai pilihan. Menerima solusi yang diminati oleh tim juga merupakan cara untuk memastikan bahwa tim merasa dilibatkan dalam proses dan membantu kami membentuk daftar awal pesaing utama untuk dievaluasi; ada terlalu banyak solusi pencarian vektor ANN di database baru dan yang sudah ada untuk menguji semuanya secara menyeluruh.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. Mengevaluasi solusi secara kualitatif</h3><p>Dimulai dengan daftar solusi yang diminati oleh tim, untuk mengevaluasi secara kualitatif solusi pencarian vektor ANN mana yang paling sesuai dengan kebutuhan kami, kami:</p>
<ul>
<li><p>Meneliti setiap solusi dan menilai seberapa baik solusi tersebut memenuhi setiap persyaratan vs bobot kepentingan dari persyaratan tersebut</p></li>
<li><p>Menghapus solusi berdasarkan kriteria kualitatif dan diskusi</p></li>
<li><p>Memilih N solusi teratas untuk diuji secara kuantitatif</p></li>
</ul>
<p>Daftar awal solusi pencarian vektor ANN yang kami sertakan:</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>Pencarian Terbuka</p></li>
<li><p>Pgvector (sudah menggunakan Postgres sebagai RDBMS)</p></li>
<li><p>Redis (sudah digunakan sebagai penyimpanan dan cache KV)</p></li>
<li><p>Cassandra (sudah digunakan untuk pencarian non-ANN)</p></li>
<li><p>Solr (sudah digunakan untuk pencarian leksikal dan bereksperimen dengan pencarian vektor)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (sudah digunakan untuk pencarian vektor ANN)</p></li>
</ul>
<p>Kami kemudian mengambil setiap persyaratan fungsional dan non-fungsional yang disebutkan oleh tim, ditambah beberapa batasan yang mewakili nilai dan tujuan teknik kami, membuat baris tersebut dalam spreadsheet, dan menimbang seberapa penting persyaratan tersebut (dari 1 hingga 3; ditampilkan dalam tabel ringkasan di bawah).</p>
<p>Untuk setiap solusi yang kami bandingkan, kami mengevaluasi (dalam skala 0 hingga 3) seberapa baik setiap sistem memenuhi persyaratan tersebut (seperti yang ditunjukkan pada tabel di bawah). Penilaian dengan cara ini agak subjektif, jadi kami memilih satu sistem dan memberikan contoh penilaian dengan alasan tertulis dan meminta para peninjau untuk merujuk kembali ke contoh tersebut. Kami juga memberikan panduan berikut untuk memberikan nilai skor: berikan nilai ini jika:</p>
<ul>
<li><p>0: Tidak ada dukungan/bukti dukungan persyaratan</p></li>
<li><p>1: Dukungan persyaratan dasar atau tidak memadai</p></li>
<li><p>2: Dukungan kebutuhan yang cukup memadai</p></li>
<li><p>3: Dukungan kebutuhan yang kuat yang melampaui solusi yang sebanding</p></li>
</ul>
<p>Kami kemudian membuat skor keseluruhan untuk setiap solusi dengan mengambil jumlah dari hasil kali skor persyaratan solusi dan tingkat kepentingan solusi tersebut (misalnya, Qdrant mendapat skor 3 untuk pemeringkatan ulang/penggabungan skor, yang memiliki tingkat kepentingan 2, jadi 3 x 2 = 6, ulangi untuk semua baris dan jumlahkan). Pada akhirnya, kita akan mendapatkan skor keseluruhan yang dapat digunakan sebagai dasar untuk menentukan peringkat dan mendiskusikan solusi, dan persyaratan mana yang paling penting (perlu diingat bahwa skor ini tidak digunakan untuk membuat keputusan akhir, tetapi sebagai alat diskusi).</p>
<p><strong><em>Catatan editor:</em></strong> <em>Ulasan ini didasarkan pada Milvus 2.4. Sejak saat itu, kami telah meluncurkan Milvus 2.5,</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6</em></a><em>, dan Milvus 3.0 sudah dekat, jadi beberapa angka mungkin sudah ketinggalan zaman. Meskipun begitu, perbandingan ini masih menawarkan wawasan yang kuat dan tetap sangat membantu.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Kategori</strong></td><td><strong>Kepentingan</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Jenis Pencarian</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Pencarian Hibrida</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pencarian Kata Kunci</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Perkiraan pencarian NN</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pencarian Rentang</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>Pemeringkatan ulang/penggabungan skor</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Metode Pengindeksan</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Mendukung beberapa metode pengindeksan</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Kuantisasi</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>Pengacakan Sensitif Lokalitas (LSH)</td><td>1</td><td>0</td><td>0Catatan: <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 mendukungnya. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Data</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Jenis vektor selain float</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Atribut metadata pada vektor (mendukung banyak atribut, ukuran record yang besar, dll.)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Opsi pemfilteran metadata (dapat memfilter metadata, memiliki pemfilteran sebelum/sesudah)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>Tipe data atribut metadata (skema yang kuat, misalnya bool, int, string, json, array)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Batas atribut metadata (kueri rentang, misalnya 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Keragaman hasil berdasarkan atribut (misalnya, mendapatkan tidak lebih dari N hasil dari setiap subreddit dalam sebuah tanggapan)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Skala</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Indeks vektor ratusan juta</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>Indeks vektor miliar</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Vektor dukungan minimal 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Vektor dukungan lebih besar dari 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 Latensi 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>Latensi P99 &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99,9% pengambilan ketersediaan</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99,99% pengindeksan/penyimpanan ketersediaan</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operasi Penyimpanan</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Dapat dihosting di AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Multi-Wilayah</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Peningkatan tanpa waktu henti</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Multi-Awan</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>API/Perpustakaan</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>RESTful API</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Pergi ke Perpustakaan</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Perpustakaan Java</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Bahasa lain (C++, Ruby, dll)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operasi Runtime</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Metrik Prometheus</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Operasi DB Dasar</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Upserts</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Operator Kubernetes</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Penomoran halaman hasil</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Menyematkan pencarian berdasarkan ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Kembalikan Embedding dengan ID Kandidat dan nilai kandidat</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ID yang diberikan pengguna</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Mampu mencari dalam konteks kumpulan berskala besar</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Cadangan / Cuplikan: mendukung kemampuan untuk membuat cadangan seluruh basis data</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>Dukungan indeks besar yang efisien (perbedaan penyimpanan dingin vs panas)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Dukungan/Komunitas</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Netralitas vendor</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Dukungan api yang kuat</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Dukungan vendor</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Kecepatan Komunitas</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Basis Pengguna Produksi</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Perasaan Komunitas</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Bintang Github</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Konfigurasi</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Penanganan Rahasia</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Sumber</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Sumber Terbuka</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Bahasa</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Rilis</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pengujian hulu</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Ketersediaan dokumentasi</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Biaya</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Biaya Efektif</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Kinerja</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Dukungan untuk menyetel pemanfaatan sumber daya untuk CPU, memori, dan disk</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pemecahan multi-simpul (pod)</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Memiliki kemampuan untuk menyetel sistem untuk menyeimbangkan antara latensi dan throughput</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pemartisian yang ditentukan pengguna (menulis)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>Multi-penyewa</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Partisi</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Replikasi</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Redundansi</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Failover Otomatis</td><td>3</td><td>2</td><td>0 Catatan: <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 mendukungnya. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Penyeimbangan Beban</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Dukungan GPU</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>Skor solusi secara keseluruhan</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>Kami mendiskusikan skor keseluruhan dan persyaratan dari berbagai sistem dan berusaha memahami apakah kami telah memberikan bobot yang tepat terhadap pentingnya persyaratan dan apakah beberapa persyaratan sangat penting sehingga harus dianggap sebagai kendala utama. Salah satu persyaratan yang kami identifikasi adalah apakah solusi tersebut bersifat open-source atau tidak, karena kami menginginkan solusi yang dapat membuat kami terlibat, berkontribusi, dan dengan cepat memperbaiki masalah-masalah kecil jika kami mengalaminya dalam skala kami. Berkontribusi dan menggunakan perangkat lunak sumber terbuka adalah bagian penting dari budaya teknik Reddit. Hal ini menghilangkan solusi yang hanya di-host (Vertex AI, Pinecone) dari pertimbangan kami.</p>
<p>Selama diskusi, kami menemukan bahwa beberapa persyaratan utama lainnya sangat penting bagi kami:</p>
<ul>
<li><p>Skala dan keandalan: kami ingin melihat bukti dari perusahaan lain yang menjalankan solusi dengan vektor 100 juta+ atau bahkan 1 miliar</p></li>
<li><p>Komunitas: Kami menginginkan solusi dengan komunitas yang sehat dengan banyak momentum di bidang yang sedang berkembang pesat ini</p></li>
<li><p>Jenis metadata yang ekspresif dan pemfilteran untuk memungkinkan lebih banyak kasus penggunaan kami (pemfilteran berdasarkan tanggal, boolean, dll.)</p></li>
<li><p>Dukungan untuk berbagai jenis indeks (tidak hanya HNSW atau DiskANN) agar lebih sesuai dengan kinerja untuk berbagai kasus penggunaan kami yang unik</p></li>
</ul>
<p>Hasil dari diskusi dan penajaman persyaratan utama membuat kami memilih untuk menguji (secara berurutan) secara kuantitatif:</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa, dan</p></li>
<li><p>Weviate</p></li>
</ol>
<p>Sayangnya, keputusan seperti ini membutuhkan waktu dan sumber daya, dan tidak ada organisasi yang memiliki keduanya dalam jumlah yang tidak terbatas. Mengingat anggaran kami, kami memutuskan untuk menguji Qdrant dan Milvus, dan membiarkan pengujian Vespa dan Weviate sebagai tujuan jangka panjang.</p>
<p>Qdrant vs Milvus juga merupakan pengujian yang menarik dari dua arsitektur yang berbeda:</p>
<ul>
<li><p><strong>Qdrant:</strong> Jenis node homogen yang melakukan semua operasi basis data vektor ANN</p></li>
<li><p><strong>Milvus:</strong> <a href="https://milvus.io/docs/architecture_overview.md">Jenis node heterogen</a> (Milvus; satu untuk kueri, satu lagi untuk pengindeksan, satu lagi untuk konsumsi data, proksi, dll.)</p></li>
</ul>
<p>Mana yang mudah disiapkan (sebuah tes dari dokumentasi mereka)? Mana yang mudah dijalankan (sebuah pengujian terhadap fitur-fitur ketahanan dan polesannya)? Dan mana yang berkinerja paling baik untuk kasus penggunaan dan skala yang kami pedulikan? Pertanyaan-pertanyaan ini kami coba jawab saat kami membandingkan solusi secara kuantitatif.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. Mengevaluasi pesaing utama secara kuantitatif</h3><p>Kami ingin lebih memahami seberapa besar skalabilitas setiap solusi, dan dalam prosesnya, merasakan bagaimana rasanya menyiapkan, mengonfigurasi, memelihara, dan menjalankan setiap solusi dalam skala besar. Untuk melakukan hal ini, kami mengumpulkan tiga set data vektor dokumen dan kueri untuk tiga kasus penggunaan yang berbeda, menyiapkan setiap solusi dengan sumber daya yang sama dalam Kubernetes, memuat dokumen ke dalam setiap solusi, dan mengirimkan beban kueri yang sama menggunakan <a href="https://k6.io/">K6 Grafana</a> dengan eksekutor tingkat kedatangan yang meningkat untuk menghangatkan sistem sebelum mencapai target throughput (misalnya, 100 QPS).</p>
<p>Kami menguji throughput, titik puncak dari setiap solusi, hubungan antara throughput dan latensi, dan bagaimana mereka bereaksi terhadap kehilangan node di bawah beban (tingkat kesalahan, dampak latensi, dll.). Yang paling menarik adalah <strong>efek penyaringan pada latensi.</strong> Kami juga melakukan pengujian sederhana ya/tidak untuk memverifikasi bahwa kemampuan dalam dokumentasi berfungsi seperti yang dijelaskan (misalnya, upserts, delete, get by ID, administrasi pengguna, dll.) dan untuk merasakan ergonomi dari API tersebut.</p>
<p><strong>Pengujian dilakukan pada Milvus v2.4 dan Qdrant v1.12.</strong> Karena keterbatasan waktu, kami tidak melakukan tuning atau pengujian secara mendalam terhadap semua jenis pengaturan indeks; pengaturan serupa digunakan pada setiap solusi, dengan bias ke arah recall ANN yang tinggi, dan pengujian difokuskan pada kinerja indeks HNSW. Sumber daya CPU dan memori yang serupa juga diberikan pada setiap solusi.</p>
<p>Dalam percobaan kami, kami menemukan beberapa perbedaan menarik antara kedua solusi tersebut. Dalam percobaan berikut, setiap solusi memiliki sekitar 340 juta vektor postingan Reddit dengan masing-masing 384 dimensi, untuk HNSW, M = 16, dan efConstruction = 100.</p>
<p>Dalam satu percobaan, kami menemukan bahwa untuk throughput kueri yang sama (100 QPS tanpa konsumsi pada waktu yang sama), menambahkan pemfilteran lebih mempengaruhi latensi Milvus daripada Qdrant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latensi kueri posting dengan pemfilteran</p>
<p>Di sisi lain, kami menemukan bahwa ada lebih banyak interaksi antara konsumsi dan beban kueri pada Qdrant daripada Milvus (ditunjukkan di bawah ini pada throughput konstan). Hal ini kemungkinan disebabkan oleh arsitektur mereka; Milvus membagi sebagian besar ingestion ke jenis node yang terpisah dari node yang melayani lalu lintas kueri, sedangkan Qdrant melayani lalu lintas ingestion dan kueri dari node yang sama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latensi kueri posting @ 100 QPS selama proses ingest</p>
<p>Ketika menguji keragaman hasil berdasarkan atribut (misalnya mendapatkan tidak lebih dari N hasil dari setiap subreddit dalam sebuah respons), kami menemukan bahwa untuk throughput yang sama, Milvus memiliki latensi yang lebih buruk daripada Qdrant (pada 100 QPS).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latensi kueri pos dengan keragaman hasil</p>
<p>Kami juga ingin melihat seberapa efektif setiap solusi berskala ketika lebih banyak replika data ditambahkan (yaitu faktor replikasi, RF, ditingkatkan dari 1 menjadi 2). Pada awalnya, dengan melihat RF=1, Qdrant mampu memberikan latensi yang memuaskan untuk throughput yang lebih tinggi daripada Milvus (QPS yang lebih tinggi tidak ditampilkan karena pengujian tidak selesai tanpa kesalahan).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant mencatatkan latensi RF = 1 untuk berbagai macam throughput</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus memposting latensi RF = 1 untuk throughput yang bervariasi</p>
<p>Namun, ketika meningkatkan faktor replikasi, latensi p99 Qdrant meningkat, tetapi Milvus mampu mempertahankan throughput yang lebih tinggi daripada Qdrant, dengan latensi yang dapat diterima (Qdrant 400 QPS tidak ditampilkan karena pengujian tidak selesai karena latensi dan kesalahan yang tinggi).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus memposting latensi RF=2 untuk throughput yang bervariasi</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant memasang latensi RF=2 untuk berbagai macam throughput</p>
<p>Karena keterbatasan waktu, kami tidak memiliki cukup waktu untuk membandingkan recall ANN antara solusi pada dataset kami, tetapi kami mempertimbangkan pengukuran recall ANN untuk solusi yang disediakan oleh <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> pada dataset yang tersedia untuk umum.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. Seleksi akhir</h3><p>Dari<strong>segi performa</strong>, tanpa banyak tuning dan hanya menggunakan HNSW, Qdrant tampaknya memiliki latensi mentah yang lebih baik dalam banyak pengujian daripada Milvus. Namun, Milvus tampak lebih baik dalam hal skala dengan peningkatan replikasi, dan memiliki isolasi yang lebih baik antara konsumsi dan beban kueri karena arsitektur tipe multi-simpulnya.</p>
<p>Dari<strong>sisi operasi,</strong> terlepas dari kompleksitas arsitektur Milvus (beberapa tipe node, bergantung pada log write-ahead eksternal seperti Kafka dan penyimpanan metadata seperti etcd), kami lebih mudah men-debug dan memperbaiki Milvus daripada Qdrant ketika salah satu dari kedua solusi tersebut mengalami masalah. Milvus juga memiliki penyeimbangan ulang otomatis ketika meningkatkan faktor replikasi dari sebuah koleksi, sedangkan pada Qdrant yang bersumber terbuka, pembuatan manual atau pembuangan pecahan diperlukan untuk meningkatkan faktor replikasi (fitur yang harus kami buat sendiri atau menggunakan versi non sumber terbuka).</p>
<p>Milvus adalah teknologi yang lebih "berbentuk Reddit" daripada Qdrant; Milvus memiliki lebih banyak kesamaan dengan tumpukan teknologi kami yang lain. Milvus ditulis dalam Golang, bahasa pemrograman backend pilihan kami, dan dengan demikian lebih mudah bagi kami untuk berkontribusi daripada Qdrant, yang ditulis dalam Rust. Milvus memiliki kecepatan proyek yang sangat baik untuk penawaran sumber terbuka dibandingkan dengan Qdrant, dan Milvus memenuhi lebih banyak persyaratan utama kami.</p>
<p>Pada akhirnya, kedua solusi tersebut memenuhi sebagian besar persyaratan kami, dan dalam beberapa kasus, Qdrant memiliki keunggulan dalam hal kinerja, tetapi kami merasa bahwa kami dapat meningkatkan skala Milvus lebih jauh, merasa lebih nyaman menjalankannya, dan Milvus lebih cocok untuk organisasi kami daripada Qdrant. Kami berharap kami memiliki lebih banyak waktu untuk menguji Vespa dan Weaviate, tetapi mereka juga mungkin dipilih karena kecocokan organisasi (Vespa berbasis Java) dan arsitektur (Weaviate adalah tipe node tunggal seperti Qdrant).</p>
<h2 id="Key-takeaways" class="common-anchor-header">Hal-hal penting yang bisa diambil<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>Tantang persyaratan yang Anda berikan dan cobalah untuk menghilangkan bias solusi yang ada.</p></li>
<li><p>Beri nilai pada kandidat solusi, dan gunakan itu untuk menginformasikan diskusi tentang persyaratan penting, bukan sebagai solusi yang paling tepat.</p></li>
<li><p>Evaluasi solusi secara kuantitatif, namun di sepanjang prosesnya, catatlah bagaimana rasanya bekerja dengan solusi tersebut.</p></li>
<li><p>Pilih solusi yang paling sesuai dengan organisasi Anda dari segi pemeliharaan, biaya, kegunaan, dan kinerja, bukan hanya karena solusi tersebut memiliki kinerja terbaik.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">Ucapan Terima Kasih<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Pekerjaan evaluasi ini dilakukan oleh Ben Kochie, Charles Njoroge, Amit Kumar, dan saya. Terima kasih juga kepada pihak-pihak lain yang telah berkontribusi dalam pekerjaan ini, termasuk Annie Yang, Konrad Reiche, Sabrina Kong, dan Andrew Johnson, untuk penelitian solusi kualitatif.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">Catatan Editor<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami ingin mengucapkan terima kasih yang sebesar-besarnya kepada tim teknisi Reddit - tidak hanya karena memilih Milvus untuk beban kerja pencarian vektor mereka, tetapi juga karena telah meluangkan waktu untuk mempublikasikan evaluasi yang sangat rinci dan adil. Jarang sekali kita melihat tingkat transparansi seperti ini dalam cara tim teknik membandingkan database, dan tulisan mereka akan sangat membantu siapa pun di komunitas Milvus (dan di luarnya) yang mencoba memahami lanskap database vektor yang sedang berkembang.</p>
<p>Seperti yang Chris sebutkan dalam tulisan tersebut, tidak ada satu pun database vektor yang "terbaik". Yang penting adalah apakah sebuah sistem sesuai dengan beban kerja, batasan, dan filosofi operasional Anda. Perbandingan Reddit mencerminkan kenyataan itu dengan baik. Milvus tidak menduduki peringkat teratas di setiap kategori, dan itu benar-benar diharapkan mengingat adanya pertukaran di berbagai model data dan tujuan kinerja.</p>
<p>Satu hal yang perlu diklarifikasi: Evaluasi Reddit menggunakan <strong>Milvus 2.4</strong>, yang merupakan rilis stabil pada saat itu. Beberapa fitur - seperti LSH dan beberapa pengoptimalan indeks - belum ada atau belum matang di 2.4, jadi beberapa skor secara alami mencerminkan garis dasar yang lebih tua. Sejak saat itu, kami telah merilis Milvus 2.5 dan kemudian <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a>, dan ini adalah sistem yang sangat berbeda dalam hal kinerja, efisiensi, dan fleksibilitas. Tanggapan komunitas sangat kuat, dan banyak tim yang telah melakukan upgrade.</p>
<p><strong>Berikut ini sekilas tentang apa saja yang baru di Milvus 2.6:</strong></p>
<ul>
<li><p><strong>Penggunaan memori hingga 72% lebih rendah</strong> dan kueri <strong>4× lebih cepat</strong> dengan kuantisasi RaBitQ 1-bit</p></li>
<li><p><strong>Pengurangan biaya 50%</strong> dengan penyimpanan berjenjang yang cerdas</p></li>
<li><p><strong>Pencarian teks lengkap BM25 4 kali lebih cepat</strong> dibandingkan dengan Elasticsearch</p></li>
<li><p><strong>Pemfilteran JSON 100x lebih cepat</strong> dengan Path Index baru</p></li>
<li><p>Arsitektur tanpa disk baru untuk pencarian yang lebih segar dengan biaya yang lebih rendah</p></li>
<li><p>Alur kerja "data masuk, data keluar" yang lebih sederhana untuk menyematkan pipeline</p></li>
<li><p>Dukungan untuk <strong>100 ribu+ koleksi</strong> untuk menangani lingkungan multi-penyewa yang besar</p></li>
</ul>
<p>Jika Anda ingin rincian lengkapnya, berikut adalah beberapa tindak lanjut yang bagus:</p>
<ul>
<li><p>Blog: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Memperkenalkan Milvus 2.6: Pencarian Vektor yang Terjangkau dalam Skala Miliaran</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Catatan rilis Milvus 2.6: </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Pembandingan Dunia Nyata untuk Basis Data Vektor - Blog Milvus</a></p></li>
</ul>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
