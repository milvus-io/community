---
id: milvus-supports-apache-parquet-file-supports.md
title: >-
  Milvus Supports Imports of Apache Parquet Files for Enhanced Data Processing
  Efficiency
author: 'Cai Zhang, Fendy Feng'
date: 2024-3-8
desc: >-
  By embracing Apache Parquet, users can streamline their data import processes
  and enjoy substantial storage and computation cost savings.
metaTitle: Milvus Supports Imports of Apache Parquet Files
cover: assets.zilliz.com/Milvus_Supports_the_Imports_of_Parquet_Files_3288e755b8.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-supports-apache-parquet-file-supports.md'
---
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>, the highly scalable vector database renowned for its ability to handle vast datasets, takes a significant step forward by introducing Parquet file support in <a href="https://zilliz.com/blog/what-is-new-in-milvus-2-3-4">version 2.3.4</a>. By embracing Apache Parquet, users can streamline their data import processes and enjoy substantial savings in storage and computation costs.</p>
<p>In our latest post, we explore Parquet’s advantages and the benefits it brings to Milvus users. We discuss the motivation behind integrating this feature and provide a step-by-step guide on seamlessly importing Parquet files into Milvus, unlocking new possibilities for efficient data management and analysis.</p>
<h2 id="What-Is-Apache-Parquet" class="common-anchor-header">What Is Apache Parquet?<button data-href="#What-Is-Apache-Parquet" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://parquet.apache.org/">Apache Parquet</a> is a popular open-source column-oriented data file format designed to enhance the efficiency of storing and processing large-scale datasets. In contrast to traditional row-oriented data formats like CSV or JSON, Parquet stores data by column, offering more efficient data compression and encoding schemes. This approach translates to improved performance, reduced storage requirements, and enhanced processing power, making it ideal for handling complex data in bulk.</p>
<h2 id="How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="common-anchor-header">How Milvus Users Benefit from the Support for Parquet File Imports<button data-href="#How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus extends support for Parquet file imports, providing users with optimized experiences and various advantages, including lowered storage and computation expenses, streamlined data management, and a simplified importing process.</p>
<h3 id="Optimized-Storage-Efficiency-and-Streamlined-Data-Management" class="common-anchor-header">Optimized Storage Efficiency and Streamlined Data Management</h3><p>Parquet provides flexible compression options and efficient encoding schemes catering to different data types, ensuring optimal storage efficiency. This flexibility is particularly valuable in cloud environments where every ounce of storage savings directly correlates to tangible cost reductions. With this new feature in Milvus, users can effortlessly consolidate all their diverse data into a single file, streamlining data management and enhancing the overall user experience. This feature is particularly beneficial for users working with variable-length Array data types, who can now enjoy a simplified data import process.</p>
<h3 id="Improved-Query-Performance" class="common-anchor-header">Improved Query Performance</h3><p>Parquet’s columnar storage design and advanced compression methods significantly enhance query performance. When conducting queries, users can focus solely on the pertinent data without scanning through the irrelevant data. This selective column reading minimizes CPU usage, resulting in faster query times.</p>
<h3 id="Broad-Language-Compatibility" class="common-anchor-header">Broad Language Compatibility</h3><p>Parquet is available in multiple languages such as Java, C++, and Python and is compatible with a large number of data processing tools. With the support of Parquet files, Milvus users using different SDKs can seamlessly generate Parquet files for parsing within the database.</p>
<h2 id="How-to-Import-Parquet-Files-into-Milvus" class="common-anchor-header">How to Import Parquet Files into Milvus<button data-href="#How-to-Import-Parquet-Files-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>If your data is already in Parquet file format, importing is easy. Upload the Parquet file to an object storage system such as MinIO, and you’re ready to import.</p>
<p>The code snippet below is an example of importing Parquet files into Milvus.</p>
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
<p>If your data is not Parquet files or has dynamic fields, you can leverage BulkWriter, our data format conversion tool, to help you generate Parquet files. BulkWriter has now embraced Parquet as its default output data format, ensuring a more intuitive experience for developers.</p>
<p>The code snippet below is an example of using BulkWriter to generate Parquet files.</p>
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
<p>Then, you can start to import your Parquet files into Milvus.</p>
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
<p>Now, your data is seamlessly integrated into Milvus.</p>
<h2 id="Whats-Next" class="common-anchor-header">What’s Next?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>As Milvus continues to support ever-growing data volumes, the challenge arises in managing sizable imports, particularly when Parquet files surpass 10GB. To tackle this challenge, we plan to segregate the import data into scalar and vector columns, creating two Parquet files per import to alleviate the I/O pressure. For datasets exceeding several hundred gigabytes, we recommend importing the data multiple times.</p>
