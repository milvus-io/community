---
id: managing-metadata-in-milvus-2.md
title: Tables 資料表中的欄位
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: 元資料表中的欄位
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Milvus 元資料管理 (2)</custom-h1><p>在上一篇部落格中，我們提到如何使用 MySQL 或 SQLite 檢視元資料。這篇文章主要是詳細介紹 metadata 表中的欄位。</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header"><code translate="no">Tables</code> 資料表中的欄位<button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>以 SQLite 為例。以下結果來自 0.5.0。有些欄位是 0.6.0 加入的，稍後會介紹。在<code translate="no">Tables</code> 中有一行指定了一個 512 維向量表，其名稱為 &lt;codetable_1</code> 。表建立時，<code translate="no">index_file_size</code> 是 1024 MB，<code translate="no">engine_type</code> 是 1 (FLAT)，<code translate="no">nlist</code> 是 16384，<code translate="no">metric_type</code> 是 1 (歐氏距離 L2)。id 是表的唯一識別碼。<code translate="no">state</code> 是表的狀態，0 表示正常狀態。<code translate="no">created_on</code> 是建立時間。<code translate="no">flag</code> 是保留給內部使用的標誌。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>下表顯示<code translate="no">Tables</code> 的欄位類型和說明。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span></p>
<p>0.6.0 中啟用了表分割，並新增了一些欄位，包括<code translate="no">owner_table</code>，<code translate="no">partition_tag</code> 和<code translate="no">version</code> 。一個向量表<code translate="no">table_1</code> ，有一個分區叫<code translate="no">table_1_p1</code> ，也是一個向量表。<code translate="no">partition_name</code> 對應於<code translate="no">table_id</code> 。分區表的欄位繼承自<code translate="no">owner table</code> ，所有者表欄位指定所有者表的名稱，而<code translate="no">partition_tag</code> 欄位指定分區的標籤。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>下表顯示 0.6.0 中的新欄位：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-new-fields-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">TableFiles 表中的欄位<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>下面的範例包含兩個檔案，都屬於<code translate="no">table_1</code> 向量表。第一個檔案的索引類型 (<code translate="no">engine_type</code>) 是 1 (FLAT)；檔案狀態 (<code translate="no">file_type</code>) 是 7 (原始檔案的備份)；<code translate="no">file_size</code> 是 411200113 位元組；向量行數是 200,000。第二個檔案的索引類型是 2 (IVFLAT)；檔案狀態是 3 (索引檔案)。第二個檔案實際上是第一個檔案的索引。我們會在接下來的文章中介紹更多資訊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-image-3.png</span> </span></p>
<p>下表顯示<code translate="no">TableFiles</code> 的欄位和說明：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">接下來的內容<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>接下來的文章將會告訴你如何在 Milvus 中使用 SQLite 來管理 metadata。敬請期待！</p>
<p>如果您有任何問題，歡迎加入我們的<a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack 頻道或</a>在 repo 中提出問題。</p>
<p>GitHub 倉庫: https://github.com/milvus-io/milvus</p>
