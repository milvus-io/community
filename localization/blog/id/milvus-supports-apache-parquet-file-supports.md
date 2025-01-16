---
id: milvus-supports-apache-parquet-file-supports.md
title: >-
  Milvus Mendukung Impor File Parket Apache untuk Meningkatkan Efisiensi
  Pemrosesan Data
author: 'Cai Zhang, Fendy Feng'
date: 2024-3-8
desc: >-
  Dengan menggunakan Apache Parquet, pengguna dapat merampingkan proses impor
  data mereka dan menikmati penghematan biaya penyimpanan dan komputasi yang
  substansial.
metaTitle: Milvus Supports Imports of Apache Parquet Files
cover: assets.zilliz.com/Milvus_Supports_the_Imports_of_Parquet_Files_3288e755b8.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-supports-apache-parquet-file-supports.md'
---
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>, basis data vektor yang sangat skalabel dan terkenal dengan kemampuannya untuk menangani kumpulan data yang sangat besar, mengambil langkah maju yang signifikan dengan memperkenalkan dukungan file Parquet di <a href="https://zilliz.com/blog/what-is-new-in-milvus-2-3-4">versi 2.3.4</a>. Dengan menggunakan Apache Parquet, pengguna dapat menyederhanakan proses impor data mereka dan menikmati penghematan yang besar dalam biaya penyimpanan dan komputasi.</p>
<p>Dalam artikel terbaru kami, kami mengeksplorasi keunggulan Parquet dan manfaat yang diberikannya kepada pengguna Milvus. Kami membahas motivasi di balik integrasi fitur ini dan memberikan panduan langkah demi langkah untuk mengimpor file Parquet dengan lancar ke Milvus, membuka kemungkinan baru untuk manajemen dan analisis data yang efisien.</p>
<h2 id="What-Is-Apache-Parquet" class="common-anchor-header">Apa itu Apache Parquet?<button data-href="#What-Is-Apache-Parquet" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://parquet.apache.org/">Apache Parquet</a> adalah format file data berorientasi kolom sumber terbuka yang populer yang dirancang untuk meningkatkan efisiensi penyimpanan dan pemrosesan kumpulan data berskala besar. Berbeda dengan format data berorientasi baris tradisional seperti CSV atau JSON, Parquet menyimpan data per kolom, menawarkan kompresi data dan skema penyandian yang lebih efisien. Pendekatan ini menghasilkan peningkatan kinerja, pengurangan kebutuhan penyimpanan, dan peningkatan daya pemrosesan, sehingga ideal untuk menangani data yang kompleks dalam jumlah besar.</p>
<h2 id="How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="common-anchor-header">Bagaimana Pengguna Milvus Mendapatkan Manfaat dari Dukungan untuk Impor File Parket<button data-href="#How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus memperluas dukungan untuk impor file Parquet, memberikan pengalaman yang dioptimalkan dan berbagai keuntungan kepada pengguna, termasuk biaya penyimpanan dan komputasi yang lebih rendah, manajemen data yang efisien, dan proses impor yang disederhanakan.</p>
<h3 id="Optimized-Storage-Efficiency-and-Streamlined-Data-Management" class="common-anchor-header">Efisiensi Penyimpanan yang Dioptimalkan dan Manajemen Data yang Efisien</h3><p>Parquet menyediakan opsi kompresi yang fleksibel dan skema pengodean yang efisien yang melayani berbagai jenis data, memastikan efisiensi penyimpanan yang optimal. Fleksibilitas ini sangat berharga dalam lingkungan cloud di mana setiap ons penghematan penyimpanan berkorelasi langsung dengan pengurangan biaya yang nyata. Dengan fitur baru di Milvus ini, pengguna dapat dengan mudah mengkonsolidasikan semua data mereka yang beragam ke dalam satu file, menyederhanakan manajemen data dan meningkatkan pengalaman pengguna secara keseluruhan. Fitur ini sangat bermanfaat bagi pengguna yang bekerja dengan tipe data Array dengan panjang variabel, yang sekarang dapat menikmati proses impor data yang disederhanakan.</p>
<h3 id="Improved-Query-Performance" class="common-anchor-header">Peningkatan Performa Kueri</h3><p>Desain penyimpanan kolumnar dan metode kompresi canggih dari Parquet secara signifikan meningkatkan kinerja kueri. Saat melakukan kueri, pengguna dapat fokus hanya pada data yang relevan tanpa memindai data yang tidak relevan. Pembacaan kolom yang selektif ini meminimalkan penggunaan CPU, sehingga menghasilkan waktu kueri yang lebih cepat.</p>
<h3 id="Broad-Language-Compatibility" class="common-anchor-header">Kompatibilitas Bahasa yang Luas</h3><p>Parket tersedia dalam berbagai bahasa seperti Java, C, dan Python dan kompatibel dengan sejumlah besar alat pemrosesan data. Dengan dukungan file Parquet, pengguna Milvus yang menggunakan SDK yang berbeda dapat dengan mudah menghasilkan file Parquet untuk diurai dalam database.</p>
<h2 id="How-to-Import-Parquet-Files-into-Milvus" class="common-anchor-header">Cara Mengimpor File Parquet ke Milvus<button data-href="#How-to-Import-Parquet-Files-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika data Anda sudah dalam format file Parquet, mengimpornya mudah. Unggah file Parquet ke sistem penyimpanan objek seperti MinIO, dan Anda siap untuk mengimpor.</p>
<p>Cuplikan kode di bawah ini adalah contoh mengimpor file Parquet ke Milvus.</p>
<pre><code translate="no">remote_files = []
<span class="hljs-keyword">try</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Prepare upload files&quot;</span>)
    minio_client = Minio(endpoint=MINIO_ADDRESS, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY,
                         secure=<span class="hljs-literal">False</span>)
    found = minio_client.bucket_exists(bucket_name)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> found:
        minio_client.make_bucket(bucket_name)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;MinIO bucket &#x27;{}&#x27; doesn&#x27;t exist&quot;</span>.<span class="hljs-built_in">format</span>(bucket_name))
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

    <span class="hljs-comment"># set your remote data path</span>
    remote_data_path = <span class="hljs-string">&quot;milvus_bulkinsert&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file</span>(<span class="hljs-params">f: <span class="hljs-built_in">str</span></span>):
        file_name = os.path.basename(f)
        minio_file_path = os.path.join(remote_data_path, <span class="hljs-string">&quot;parquet&quot;</span>, file_name)
        minio_client.fput_object(bucket_name, minio_file_path, f)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Upload file &#x27;{}&#x27; to &#x27;{}&#x27;&quot;</span>.<span class="hljs-built_in">format</span>(f, minio_file_path))
        remote_files.append(minio_file_path)

    upload_file(data_file)

<span class="hljs-keyword">except</span> S3Error <span class="hljs-keyword">as</span> e:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Failed to connect MinIO server {}, error: {}&quot;</span>.<span class="hljs-built_in">format</span>(MINIO_ADDRESS, e))
    <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Successfully upload files: {}&quot;</span>.<span class="hljs-built_in">format</span>(remote_files))
<span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>, remote_files
<button class="copy-code-btn"></button></code></pre>
<p>Jika data Anda bukan file Parquet atau memiliki bidang dinamis, Anda dapat memanfaatkan BulkWriter, alat konversi format data kami, untuk membantu Anda menghasilkan file Parquet. BulkWriter kini telah menggunakan Parquet sebagai format data keluaran default, memastikan pengalaman yang lebih intuitif bagi pengembang.</p>
<p>Cuplikan kode di bawah ini adalah contoh penggunaan BulkWriter untuk menghasilkan file Parquet.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> json

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    RemoteBulkWriter,
    BulkFileType,
)

remote_writer = RemoteBulkWriter(
        schema=your_collection_schema,
        remote_path=<span class="hljs-string">&quot;your_remote_data_path&quot;</span>,
        connect_param=RemoteBulkWriter.ConnectParam(
            endpoint=YOUR_MINIO_ADDRESS,
            access_key=YOUR_MINIO_ACCESS_KEY,
            secret_key=YOUR_MINIO_SECRET_KEY,
            bucket_name=<span class="hljs-string">&quot;a-bucket&quot;</span>,
        ),
        file_type=BulkFileType.PARQUET,
)

<span class="hljs-comment"># append your data</span>
batch_count = <span class="hljs-number">10000</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    row = {
        <span class="hljs-string">&quot;id&quot;</span>: i,
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">5</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: i % <span class="hljs-number">128</span>,
        <span class="hljs-string">&quot;int16&quot;</span>: i % <span class="hljs-number">1000</span>,
        <span class="hljs-string">&quot;int32&quot;</span>: i % <span class="hljs-number">100000</span>,
        <span class="hljs-string">&quot;int64&quot;</span>: i,
        <span class="hljs-string">&quot;float&quot;</span>: i / <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;double&quot;</span>: i / <span class="hljs-number">7</span>,
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: {<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>},
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    }
    remote_writer.append_row(row)

<span class="hljs-comment"># append rows by numpy type</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    remote_writer.append_row({
        <span class="hljs-string">&quot;id&quot;</span>: np.int64(i + batch_count),
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: np.int8(i % <span class="hljs-number">128</span>),
        <span class="hljs-string">&quot;int16&quot;</span>: np.int16(i % <span class="hljs-number">1000</span>),
        <span class="hljs-string">&quot;int32&quot;</span>: np.int32(i % <span class="hljs-number">100000</span>),
        <span class="hljs-string">&quot;int64&quot;</span>: np.int64(i),
        <span class="hljs-string">&quot;float&quot;</span>: np.float32(i / <span class="hljs-number">3</span>),
        <span class="hljs-string">&quot;double&quot;</span>: np.float64(i / <span class="hljs-number">7</span>),
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: json.dumps({<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>}),
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    })

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.total_row_count}</span> rows appends&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.buffer_row_count}</span> rows in buffer not flushed&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generate data files...&quot;</span>)
remote_writer.commit()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Data files have been uploaded: <span class="hljs-subst">{remote_writer.batch_files}</span>&quot;</span>)
remote_files = remote_writer.batch_files
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian, Anda dapat mulai mengimpor file Parquet Anda ke Milvus.</p>
<pre><code translate="no">remote_files = [remote_file_path]
task_id = utility.do_bulk_insert(collection_name=collection_name,
                                 files=remote_files)

task_ids = [task_id]         
states = wait_tasks_to_state(task_ids, BulkInsertState.ImportCompleted)
complete_count = 0
for state in states:
    if state.state == BulkInsertState.ImportCompleted:
        complete_count = complete_count + 1
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang, data Anda telah terintegrasi dengan mulus ke dalam Milvus.</p>
<h2 id="Whats-Next" class="common-anchor-header">Apa Selanjutnya?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Karena Milvus terus mendukung volume data yang terus bertambah, tantangan muncul dalam mengelola impor yang cukup besar, terutama ketika file Parquet melebihi 10GB. Untuk mengatasi tantangan ini, kami berencana untuk memisahkan data impor ke dalam kolom skalar dan vektor, membuat dua file Parquet per impor untuk mengurangi tekanan I/O. Untuk kumpulan data yang melebihi beberapa ratus gigabyte, kami sarankan untuk mengimpor data beberapa kali.</p>
