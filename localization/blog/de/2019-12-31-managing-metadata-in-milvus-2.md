---
id: managing-metadata-in-milvus-2.md
title: Fields in the Tables table
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Fields in the Metadata Table
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Milvus Metadata Management (2)</custom-h1><p>In the last blog, we mentioned how to view your metadata using MySQL or SQLite. This article mainly intends to introduce in detail the fields in the metadata tables.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Fields in the <code translate="no">Tables</code> table<button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Take SQLite as an example. The following result comes from 0.5.0. Some fields are added to 0.6.0, which will be introduced later. There is a row in <code translate="no">Tables</code> specifying a 512-dimensional vector table with the name &lt;codetable_1</code>. When the table is created, <code translate="no">index_file_size</code> is 1024 MB, <code translate="no">engine_type</code> is 1 (FLAT), <code translate="no">nlist</code> is 16384, <code translate="no">metric_type</code> is 1 (Euclidean distance L2). id is the unique identifier of the table. <code translate="no">state</code> is the state of the table with 0 indicating a normal state. <code translate="no">created_on</code> is the creation time. <code translate="no">flag</code> is the flag reserved for internal use.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
    <span>1-image-1.png</span>
  </span>
</p>
<p>The following table shows field types and descriptions of the fields in <code translate="no">Tables</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
    <span>2-field-types-descriptions-milvus-metadata.png</span>
  </span>
</p>
<p>Table partitioning is enabled in 0.6.0 with a few new fields, including <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> and <code translate="no">version</code>. A vector table, <code translate="no">table_1</code>, has a partition called <code translate="no">table_1_p1</code>, which is also a vector table. <code translate="no">partition_name</code> corresponds to <code translate="no">table_id</code>. Fields in a partition table are inherited from the <code translate="no">owner table</code>, with the owner table field specifying the name of the owner table and the <code translate="no">partition_tag</code> field specifying the tag of the partition.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
    <span>3-image-2.png</span>
  </span>
</p>
<p>The following table shows new fields in 0.6.0:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
    <span>4-new-fields-milvus-0.6.0.png</span>
  </span>
</p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Fields in the TableFiles table<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>The following example contains two files, which both belong to the <code translate="no">table_1</code> vector table. The index type (<code translate="no">engine_type</code>) of the first file is 1 (FLAT); file status (<code translate="no">file_type</code>) is 7 (backup of the original file); <code translate="no">file_size</code> is 411200113 bytes; number of vector rows is 200,000. The index type of the second file is 2 (IVFLAT); file status is 3 (index file). The second file is actually the index of the first file. We will introduce more information in upcoming articles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
    <span>5-image-3.png</span>
  </span>
</p>
<p>The following table shows fields and descriptions of <code translate="no">TableFiles</code>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
    <span>6-field-types-descriptions-tablefile.png</span>
  </span>
</p>
<h2 id="What’s-coming-next" class="common-anchor-header">What’s coming next<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>The upcoming article will show you how to use SQLite to manage metadata in Milvus. Stay tuned!</p>
<p>Any questions, welcome to join our <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack channel</a>or file an issue in the repo.</p>
<p>GitHub repo: https://github.com/milvus-io/milvus</p>
