---
id: 2019-12-27-meta-table.md
title: Milvus Metadata Management (2) Fields in the Metadata Table
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Learn about the detail of the fields in metadata tables in Milvus.
cover: null
tag: Engineering
---
<custom-h1>Milvus Metadata Management (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Fields in the Metadata Table<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
<p>Author: Yihua Mo</p>
<p>Date: 2019-12-27</p>
</blockquote>
<p>In the last blog, we mentioned how to view your metadata using MySQL or SQLite. This article mainly intends to introduce in detail the fields in the metadata tables.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Fields in the &quot;<code translate="no">Tables</code>” table</h3><p>Take SQLite as an example. The following result comes from 0.5.0. Some fields are added to 0.6.0, which will be introduced later. There is a row in <code translate="no">Tables</code> specifying a 512-dimensional vector table with the name <code translate="no">table_1</code>. When the table is created, <code translate="no">index_file_size</code> is 1024 MB, <code translate="no">engine_type</code> is 1 (FLAT), <code translate="no">nlist</code> is 16384, <code translate="no">metric_type</code> is 1 (Euclidean distance L2). <code translate="no">id</code> is the unique identifier of the table. <code translate="no">state</code> is the state of the table with 0 indicating a normal state. <code translate="no">created_on</code> is the creation time. <code translate="no">flag</code> is the flag reserved for internal use.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
    <span>tables</span>
  </span>
</p>
<p>The following table shows field types and descriptions of the fields in <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Field Name</th><th style="text-align:left">Data Type</th><th style="text-align:left">Description</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Unique identifier of the vector table. <code translate="no">id</code> automatically increments.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Name of the vector table. <code translate="no">table_id</code> must be user-defined and follow Linux filename guidelines.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">State of the vector table. 0 stands for normal and 1 stands for deleted (soft delete).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Vector dimension of the vector table. Must be user-defined.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Number of milliseconds from Jan 1, 1970 to the time when the table is created.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Flag for internal use, such as whether the vector id is user-defined. The default is 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">If the size of a data file reaches <code translate="no">index_file_size</code>, the file is not combined and is used to build indexes. The default is 1024 (MB).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Type of index to build for a vector table. The default is 0, which specifies invalid index. 1 specifies FLAT. 2 specifies IVFLAT. 3 specifies IVFSQ8. 4 specifies NSG. 5 specifies IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Number of clusters the vectors in each data file are divided into when the index is being built. The default is 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Method to compute vector distance. 1 specifies Euclidean distance (L1) and 2 specifies inner product.</td></tr>
</tbody>
</table>
<p>Table partitioning is enabled in 0.6.0 with a few new fields, including <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> and <code translate="no">version</code>. A vector table, <code translate="no">table_1</code>, has a partition called <code translate="no">table_1_p1</code>, which is also a vector table. <code translate="no">partition_name</code> corresponds to <code translate="no">table_id</code>. Fields in a partition table are inherited from the owner table, with the <code translate="no">owner table</code> field specifying the name of the owner table and the <code translate="no">partition_tag</code> field specifying the tag of the partition.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
    <span>tables_new</span>
  </span>
</p>
<p>The following table shows new fields in 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">Field Name</th><th style="text-align:left">Data Type</th><th style="text-align:left">Description</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">string</td><td style="text-align:left">Parent table of the partition.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">string</td><td style="text-align:left">Tag of the partition. Must not be an empty string.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">string</td><td style="text-align:left">Milvus version.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Fields in the “<code translate="no">TableFiles&quot;</code> table</h3><p>The following example contains two files, which both belong to the <code translate="no">table_1</code> vector table. The index type (<code translate="no">engine_type</code>) of the first file is 1 (FLAT); file status (<code translate="no">file_type</code>) is 7 (backup of the original file); <code translate="no">file_size</code> is 411200113 bytes; number of vector rows is 200,000. The index type of the second file is 2 (IVFLAT); file status is 3 (index file). The second file is actually the index of the first file. We will introduce more information in upcoming articles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
    <span>tablefiles</span>
  </span>
</p>
<p>The following table shows fields and descriptions of <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Field Name</th><th style="text-align:left">Data Type</th><th style="text-align:left">Description</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Unique identifier of a vector table. <code translate="no">id</code> automatically increments.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Name of the vector table.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Type of index to build for a vector table. The default is 0, which specifies invalid index. 1 specifies FLAT. 2 specifies IVFLAT. 3 specifies IVFSQ8. 4 specifies NSG. 5 specifies IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Filename generated from file creation time. Equals 1000 multiplied by the number of milliseconds from Jan 1, 1970 to the time when the table is created.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">File status. 0 specifies a newly generated raw vector data file. 1 specifies raw vector data file. 2 specifies that index will be built for the file. 3 specifies that the file is an index file. 4 specifies that the file will be deleted (soft delete). 5 specifies that the file is newly-generated and used to store combination data. 6 specifies that the file is newly-generated and used to store index data. 7 specifies the backup status of the raw vector data file.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">File size in bytes.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Number of vectors in a file.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Timestamp for the latest update time, which specifies the number of milliseconds from Jan 1, 1970 to the time when the table is created.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Number of milliseconds from Jan 1, 1970 to the time when the table is created.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Date when the table is created. It is still here for historical reasons and will be removed in future versions.</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">Related blogs<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive Scale Vector Search Engine</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus Metadata Management (1): How to View Metadata</a></li>
</ul>
