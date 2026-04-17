---
id: Milvus-Data-Migration-Tool.md
title: Memperkenalkan Alat Migrasi Data Milvus
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Pelajari cara menggunakan alat migrasi data Milvus untuk meningkatkan
  efisiensi manajemen data dan mengurangi biaya DevOps.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Memperkenalkan Alat Migrasi Data Milvus</custom-h1><p><em><strong>Catatan Penting</strong>: Alat Migrasi Data Mivus sudah tidak digunakan lagi. Untuk migrasi data dari database lain ke Milvus, kami sarankan Anda menggunakan Alat Migrasi Milvus yang lebih canggih.</em></p>
<p>Alat migrasi Milvus saat ini mendukung:</p>
<ul>
<li>Elasticsearch ke Milvus 2.x</li>
<li>Faiss ke Milvus 2.x</li>
<li>Milvus 1.x ke Milvus 2.x</li>
<li>Milvus 2.3.x ke Milvus 2.3.x atau yang lebih baru</li>
</ul>
<p>Kami akan mendukung migrasi dari lebih banyak sumber data vektor seperti Pinecone, Chroma, dan Qdrant. Tetap ikuti perkembangannya.</p>
<p><strong>Untuk informasi lebih lanjut, lihat <a href="https://milvus.io/docs/migrate_overview.md">dokumentasi migrasi Milvus</a> atau <a href="https://github.com/zilliztech/milvus-migration">repositori GitHub</a>.</strong></p>
<p>--------------------------------- <strong>Alat Migrasi Data Mivus telah tidak digunakan lagi</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Gambaran Umum</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) adalah sebuah alat sumber terbuka yang dirancang khusus untuk mengimpor dan mengekspor file data dengan Milvus. MilvusDM dapat sangat meningkatkan efisiensi pengelolaan data dan mengurangi biaya DevOps dengan cara-cara berikut:</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss ke Milvus</a>: Mengimpor data yang belum di-zip dari Faiss ke Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 ke Milvus</a>: Mengimpor file HDF5 ke Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus ke Milvus</a>: Memindahkan data dari Milvus sumber ke Milvus target yang berbeda.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus ke HDF5</a>: Menyimpan data dalam Milvus sebagai file HDF5.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 1.png</span> </span></p>
<p>MilvusDM dihosting di <a href="https://github.com/milvus-io/milvus-tools">Github</a> dan dapat dengan mudah diinstal dengan menjalankan baris perintah <code translate="no">pip3 install pymilvusdm</code>. MilvusDM memungkinkan Anda untuk memigrasikan data pada koleksi atau partisi tertentu. Pada bagian berikut, kami akan menjelaskan cara menggunakan setiap jenis migrasi data.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss ke Milvus</h3><h4 id="Steps" class="common-anchor-header">Langkah-langkah</h4><p>1. Unduh <strong>F2M.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Tetapkan parameter berikut ini:</p>
<ul>
<li><p><code translate="no">data_path</code>: Jalur data (vektor dan ID yang sesuai) di Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: Alamat server Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Port server Milvus.</p></li>
<li><p><code translate="no">mode</code>: Data dapat diimpor ke Milvus dengan menggunakan mode-mode berikut:</p>
<ul>
<li><p>Lewati: Abaikan data jika koleksi atau partisi sudah ada.</p></li>
<li><p>Tambahkan: Menambahkan data jika koleksi atau partisi sudah ada.</p></li>
<li><p>Timpa: Menghapus data sebelum disisipkan jika koleksi atau partisi sudah ada.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nama koleksi penerima untuk impor data.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nama partisi penerima untuk impor data.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informasi spesifik koleksi seperti dimensi vektor, ukuran file indeks, dan metrik jarak.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Jalankan <strong>F2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Contoh Kode</h4><p>1. Baca file Faiss untuk mengambil vektor dan ID yang sesuai.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. Masukkan data yang diambil ke dalam Milvus:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 ke Milvus</h3><h4 id="Steps" class="common-anchor-header">Langkah-langkah</h4><p>1. Unduh <strong>H2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Tetapkan parameter berikut:</p>
<ul>
<li><p><code translate="no">data_path</code>: Jalur ke file HDF5.</p></li>
<li><p><code translate="no">data_dir</code>: Direktori yang menyimpan file HDF5.</p></li>
<li><p><code translate="no">dest_host</code>: Alamat server Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Port server Milvus.</p></li>
<li><p><code translate="no">mode</code>: Data dapat diimpor ke Milvus dengan menggunakan mode-mode berikut:</p>
<ul>
<li><p>Lewati: Abaikan data jika koleksi atau partisi sudah ada.</p></li>
<li><p>Tambahkan: Menambahkan data jika koleksi atau partisi sudah ada.</p></li>
<li><p>Timpa: Menghapus data sebelum disisipkan jika koleksi atau partisi sudah ada.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nama koleksi penerima untuk impor data.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nama partisi penerima untuk impor data.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informasi spesifik koleksi seperti dimensi vektor, ukuran file indeks, dan metrik jarak.</p></li>
</ul>
<blockquote>
<p>Tetapkan salah satu dari <code translate="no">data_path</code> atau <code translate="no">data_dir</code>. <strong>Jangan</strong> mengatur keduanya. Gunakan <code translate="no">data_path</code> untuk menentukan beberapa jalur file, atau <code translate="no">data_dir</code> untuk menentukan direktori yang menyimpan file data Anda.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Jalankan <strong>H2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Contoh Kode</h4><p>1. Baca file HDF5 untuk mengambil vektor dan ID yang sesuai:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. Masukkan data yang diambil ke dalam Milvus:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus ke Milvus</h3><h4 id="Steps" class="common-anchor-header">Langkah-langkah</h4><p>1. Unduh <strong>M2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Tetapkan parameter berikut:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Sumber jalur kerja Milvus.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Pengaturan MySQL Sumber Milvus. Jika MySQL tidak digunakan, atur mysql_parameter sebagai ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nama-nama koleksi dan partisi-partisinya dalam Milvus sumber.</p></li>
<li><p><code translate="no">dest_host</code>: Alamat server Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Port server Milvus.</p></li>
<li><p><code translate="no">mode</code>: Data dapat diimpor ke Milvus dengan menggunakan mode-mode berikut:</p>
<ul>
<li><p>Lewati: Abaikan data jika koleksi atau partisi sudah ada.</p></li>
<li><p>Tambahkan: Menambahkan data jika koleksi atau partisi sudah ada.</p></li>
<li><p>Menimpa: Hapus data sebelum penyisipan jika koleksi atau partisi sudah ada, hapus data sebelum penyisipan jika koleksi atau partisi sudah ada.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Jalankan <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Contoh Kode</h4><p>1. Menurut metadata koleksi atau partisi yang ditentukan, baca file di bawah <strong>milvus/db</strong> di drive lokal Anda untuk mengambil vektor dan ID yang sesuai dari sumber Milvus.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. Masukkan data yang diambil ke dalam Milvus target.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Milvus ke HDF5</h3><h4 id="Steps" class="common-anchor-header">Langkah-langkah</h4><p>1. Unduh <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Atur parameter berikut:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Sumber jalur kerja Milvus.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Pengaturan MySQL Sumber Milvus. Jika MySQL tidak digunakan, atur mysql_parameter sebagai ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nama-nama koleksi dan partisi-partisinya dalam Milvus sumber.</p></li>
<li><p><code translate="no">data_dir</code>: Direktori untuk menyimpan file HDF5 yang disimpan.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Jalankan <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Contoh Kode</h4><p>1. Menurut metadata koleksi atau partisi tertentu, baca file di bawah <strong>milvus/db</strong> di drive lokal Anda untuk mengambil vektor dan ID yang sesuai.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. Simpan data yang diambil sebagai file HDF5.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">Struktur File MilvusDM</h3><p>Diagram alir di bawah ini menunjukkan bagaimana MilvusDM melakukan tugas yang berbeda sesuai dengan file YAML yang diterimanya:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>Struktur file MilvusDM:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>inti</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Melakukan operasi klien di Milvus.</p></li>
<li><p><strong>read_data.py</strong>: Membaca berkas data HDF5 pada drive lokal Anda. (Tambahkan kode Anda di sini untuk mendukung pembacaan file data dalam format lain).</p></li>
<li><p><strong>read_faiss_data.py</strong>: Membaca file data dalam Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Membaca file data dalam Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Membaca metadata di Milvus.</p></li>
<li><p><strong>data_to_milvus.py</strong>: Membuat koleksi atau partisi berdasarkan parameter dalam file YAML dan mengimpor vektor dan ID vektor yang sesuai ke dalam Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Menyimpan data sebagai file HDF5.</p></li>
<li><p><strong>write_logs.py</strong>: Menulis log selama runtime.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Mengimpor data dari Faiss ke Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Mengimpor data dalam file HDF5 ke dalam Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Memindahkan data dari Milvus sumber ke Milvus target.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Mengekspor data dalam Milvus dan menyimpannya sebagai file HDF5.</p></li>
<li><p><strong>main.py</strong>: Melakukan tugas-tugas yang sesuai dengan file YAML yang diterima.</p></li>
<li><p><strong>setting.py</strong>: Konfigurasi yang berkaitan dengan menjalankan kode MilvusDM.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Membuat paket file <strong>pymilvusdm</strong> dan mengunggahnya ke PyPI (Python Package Index).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Rekap</h3><p>MilvusDM terutama menangani migrasi data masuk dan keluar dari Milvus, yang meliputi Faiss ke Milvus, HDF5 ke Milvus, Milvus ke Milvus, dan Milvus ke HDF5.</p>
<p>Fitur-fitur berikut ini direncanakan untuk rilis yang akan datang:</p>
<ul>
<li><p>Mengimpor data biner dari Faiss ke Milvus.</p></li>
<li><p>Daftar blokir dan daftar izin untuk migrasi data antara Milvus sumber dan Milvus target.</p></li>
<li><p>Menggabungkan dan mengimpor data dari beberapa koleksi atau partisi di Milvus sumber ke dalam koleksi baru di Milvus target.</p></li>
<li><p>Pencadangan dan pemulihan data Milvus.</p></li>
</ul>
<p>Proyek MilvusDM bersumber terbuka di <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Setiap dan semua kontribusi untuk proyek ini dipersilakan. Berikan bintang 🌟, dan jangan ragu untuk mengajukan <a href="https://github.com/milvus-io/milvus-tools/issues">masalah</a> atau mengirimkan kode Anda sendiri!</p>
