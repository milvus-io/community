---
id: managing-metadata-in-milvus-2.md
title: Tables 表中的字段
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: 元数据表中的字段
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Milvus 元数据管理 (2)</custom-h1><p>在上一篇博客中，我们提到了如何使用 MySQL 或 SQLite 查看元数据。本文主要详细介绍元数据表中的字段。</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header"><code translate="no">Tables</code> 表中的字段<button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>以 SQLite 为例。以下结果来自 0.5.0 版。0.6.0 中添加了一些字段，稍后将对其进行介绍。<code translate="no">Tables</code> 中有一行指定了一个 512 维的向量表，其名称为 &lt;codetable_1</code> 。表创建时，<code translate="no">index_file_size</code> 为 1024 MB，<code translate="no">engine_type</code> 为 1 (FLAT)，<code translate="no">nlist</code> 为 16384，<code translate="no">metric_type</code> 为 1 (欧氏距离 L2)。id 是表的唯一标识符。<code translate="no">state</code> 是表的状态，0 表示正常状态。<code translate="no">created_on</code> 是创建时间。<code translate="no">flag</code> 是内部使用的保留标志。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>下表列出了<code translate="no">Tables</code> 中的字段类型和说明。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span></p>
<p>0.6.0 中启用了表分区，并增加了一些新字段，包括<code translate="no">owner_table</code>，<code translate="no">partition_tag</code> 和<code translate="no">version</code> 。一个向量表<code translate="no">table_1</code> 有一个名为<code translate="no">table_1_p1</code> 的分区，它也是一个向量表。<code translate="no">partition_name</code> 对应<code translate="no">table_id</code> 。分区表中的字段继承自<code translate="no">owner table</code> ，所有者表字段指定所有者表的名称，<code translate="no">partition_tag</code> 字段指定分区的标记。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>下表列出了 0.6.0 中的新字段：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-new-fields-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">TableFiles 表中的字段<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>下面的示例包含两个文件，它们都属于<code translate="no">table_1</code> 向量表。第一个文件的索引类型 (<code translate="no">engine_type</code>) 为 1 (FLAT)；文件状态 (<code translate="no">file_type</code>) 为 7 (原始文件的备份)；<code translate="no">file_size</code> 为 411200113 字节；向量行数为 200,000 行。第二个文件的索引类型是 2 (IVFLAT)；文件状态是 3（索引文件）。第二个文件实际上是第一个文件的索引。我们将在以后的文章中介绍更多信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-image-3.png</span> </span></p>
<p>下表列出了<code translate="no">TableFiles</code> 的字段和说明：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">下一篇文章<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>即将发表的文章将向你展示如何在 Milvus 中使用 SQLite 管理元数据。敬请期待！</p>
<p>如有任何问题，欢迎加入我们的<a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack 频道，或</a>在软件仓库中提交问题。</p>
<p>GitHub 仓库： https://github.com/milvus-io/milvus</p>
