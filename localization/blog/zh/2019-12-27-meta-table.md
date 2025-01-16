---
id: 2019-12-27-meta-table.md
title: Milvus 元数据管理 (2) 元数据表中的字段
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: 了解 Milvus 中元数据表中字段的详细信息。
cover: null
tag: Engineering
---
<custom-h1>Milvus 元数据管理 (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">元数据表中的字段<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
<p>作者：莫益华莫一华</p>
<p>日期： 2019-12-27</p>
</blockquote>
<p>在上一篇博客中，我们提到了如何使用 MySQL 或 SQLite 查看元数据。本文主要详细介绍元数据表中的字段。</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header"><code translate="no">Tables</code>&quot; 表中的字段</h3><p>以 SQLite 为例。以下结果来自 0.5.0 版。0.6.0 中添加了一些字段，稍后将对其进行介绍。<code translate="no">Tables</code> 中有一行指定了一个 512 维的向量表，其名称为<code translate="no">table_1</code> 。表创建时，<code translate="no">index_file_size</code> 为 1024 MB，<code translate="no">engine_type</code> 为 1 (FLAT)，<code translate="no">nlist</code> 为 16384，<code translate="no">metric_type</code> 为 1 (欧氏距离 L2)。<code translate="no">id</code> 为表的唯一标识符。<code translate="no">state</code> 为表的状态，0 表示正常状态。<code translate="no">created_on</code> 为创建时间。<code translate="no">flag</code> 为内部使用的保留标志。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>表格</span> </span></p>
<p>下表列出了<code translate="no">Tables</code> 中的字段类型和说明。</p>
<table>
<thead>
<tr><th style="text-align:left">字段名称</th><th style="text-align:left">数据类型</th><th style="text-align:left">说明</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">向量表的唯一标识符。<code translate="no">id</code> 会自动递增。</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">字符串</td><td style="text-align:left">向量表的名称。<code translate="no">table_id</code> 必须由用户定义，并遵循 Linux 文件名指南。</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">向量表的状态。0 表示正常，1 表示已删除（软删除）。</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">向量表的向量维数。必须由用户定义。</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">从 1970 年 1 月 1 日到创建表格时的毫秒数。</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">内部使用的标志，例如向量 id 是否由用户定义。默认值为 0。</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">如果数据文件的大小达到<code translate="no">index_file_size</code> ，则该文件不会合并，而是用于建立索引。默认值为 1024 (MB)。</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">要为向量表建立的索引类型。默认值为 0，表示无效索引。1 表示 FLAT。2 表示 IVFLAT。4 指定 NSG。5 指定 IVFSQ8H。</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">建立索引时，每个数据文件中的向量所划分的簇数。默认值为 16384。</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">计算向量距离的方法。1 指定欧氏距离（L1），2 指定内积。</td></tr>
</tbody>
</table>
<p>0.6.0 中启用了表分区，并增加了一些新字段，包括<code translate="no">owner_table</code>，<code translate="no">partition_tag</code> 和<code translate="no">version</code> 。一个向量表<code translate="no">table_1</code> 有一个名为<code translate="no">table_1_p1</code> 的分区，它也是一个向量表。<code translate="no">partition_name</code> 对应于<code translate="no">table_id</code> 。分区表中的字段继承自所有者表，其中<code translate="no">owner table</code> 字段指定所有者表的名称，<code translate="no">partition_tag</code> 字段指定分区的标记。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>新建表</span> </span></p>
<p>下表列出了 0.6.0 中的新字段：</p>
<table>
<thead>
<tr><th style="text-align:left">字段名称</th><th style="text-align:left">数据类型</th><th style="text-align:left">字段名称</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">字符串</td><td style="text-align:left">分区的父表。</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">字符串</td><td style="text-align:left">分区的标记。不得为空字符串。</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">字符串</td><td style="text-align:left">Milvus 版本。</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header"><code translate="no">TableFiles&quot;</code> 表中的字段</h3><p>下面的示例包含两个文件，它们都属于<code translate="no">table_1</code> 向量表。第一个文件的索引类型 (<code translate="no">engine_type</code>) 是 1 (FLAT)；文件状态 (<code translate="no">file_type</code>) 是 7（原始文件的备份）；<code translate="no">file_size</code> 是 411200113 字节；向量行数是 200000。第二个文件的索引类型是 2 (IVFLAT)；文件状态是 3（索引文件）。第二个文件实际上是第一个文件的索引。我们将在以后的文章中介绍更多信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>表文件</span> </span></p>
<p>下表列出了<code translate="no">TableFiles</code> 的字段和说明：</p>
<table>
<thead>
<tr><th style="text-align:left">字段名称</th><th style="text-align:left">数据类型</th><th style="text-align:left">说明</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">向量表的唯一标识符。<code translate="no">id</code> 会自动递增。</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">字符串</td><td style="text-align:left">向量表的名称。</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">要为向量表建立的索引类型。默认值为 0，表示无效索引。1 表示 FLAT，2 表示 IVFLAT，3 表示 IVFSQ8，4 表示 NSG。4 指定 NSG。5 指定 IVFSQ8H。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">字符串</td><td style="text-align:left">根据文件创建时间生成的文件名。等于 1000 乘以从 1970 年 1 月 1 日到创建表格时的毫秒数。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">文件状态。0 表示新生成的原始向量数据文件。1 表示原始向量数据文件。2 表示将为文件建立索引。3 表示该文件是一个索引文件。4 表示将删除该文件（软删除）。5 表示该文件是新生成的，用于存储组合数据。6 表示该文件是新生成的，用于存储索引数据。7 指定原始向量数据文件的备份状态。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">文件大小（字节）。</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">文件中的向量个数。</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">最新更新时间的时间戳，指定从 1970 年 1 月 1 日到创建表格时的毫秒数。</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">从 1970 年 1 月 1 日到创建表格时的毫秒数。</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">创建表格的日期。由于历史原因，此处仍保留此参数，并将在未来版本中删除。</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">相关博客<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">在大规模向量搜索引擎中管理数据</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus 元数据管理（1）：如何查看元数据</a></li>
</ul>
