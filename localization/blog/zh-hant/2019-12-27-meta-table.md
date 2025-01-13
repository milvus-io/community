---
id: 2019-12-27-meta-table.md
title: Milvus 元資料管理 (2) 元資料表中的欄位
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: 了解 Milvus 中元資料表中欄位的詳細資訊。
cover: null
tag: Engineering
---
<custom-h1>Milvus 元資料管理 (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">元資料表中的欄位<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
<p>作者：莫毅華</p>
<p>日期： 2019-12-27</p>
</blockquote>
<p>在上一篇博客中，我們提到了如何使用 MySQL 或 SQLite 檢視元資料。本文主要想詳細介紹一下元資料表中的欄位。</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header"><code translate="no">Tables</code>&quot; 表中的欄位</h3><p>以 SQLite 為例。以下結果來自 0.5.0。有些欄位是在 0.6.0 加入的，稍後會介紹。在<code translate="no">Tables</code> 中有一列指定了一個 512 維向量表，其名稱為<code translate="no">table_1</code> 。表建立時，<code translate="no">index_file_size</code> 是 1024 MB，<code translate="no">engine_type</code> 是 1 (FLAT)，<code translate="no">nlist</code> 是 16384，<code translate="no">metric_type</code> 是 1 (歐氏距離 L2)。<code translate="no">id</code> 是表的唯一識別碼。<code translate="no">state</code> 是表的狀態，0 表示正常狀態。<code translate="no">created_on</code> 是建立時間。<code translate="no">flag</code> 是保留給內部使用的標誌。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>表格</span> </span></p>
<p>下表顯示<code translate="no">Tables</code> 中的欄位類型和說明。</p>
<table>
<thead>
<tr><th style="text-align:left">欄位名稱</th><th style="text-align:left">資料類型</th><th style="text-align:left">說明</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">向量表的唯一識別碼。<code translate="no">id</code> 自動遞增。</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">字串</td><td style="text-align:left">向量表的名稱。<code translate="no">table_id</code> 必須由使用者定義，並遵循 Linux 檔名指引。</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">向量表的狀態。0 代表正常，1 代表已刪除 (軟刪除)。</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">向量表的向量尺寸。必須由使用者定義。</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">從 1970 年 1 月 1 日到資料表建立時間的毫秒數。</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">內部使用的旗標，例如向量 id 是否是使用者定義。預設為 0。</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">如果資料檔案的大小達到<code translate="no">index_file_size</code> ，該檔案不會合併，而是用來建立索引。預設為 1024 (MB)。</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">要為向量表建立的索引類型。預設為 0，表示無效索引。1 指定 FLAT。2 指定 IVFLAT。3 指定 IVFSQ8。4 指定 NSG。5 指定 IVFSQ8H。</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">建立索引時，每個資料檔中向量所分成的叢集數。預設為 16384。</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">計算向量距離的方法。1 指定 Euclidean distance (L1)，2 指定 inner product。</td></tr>
</tbody>
</table>
<p>0.6.0 啟用了表分割，並新增了一些欄位，包括<code translate="no">owner_table</code>，<code translate="no">partition_tag</code> 和<code translate="no">version</code> 。一個向量表<code translate="no">table_1</code> ，有一個分區叫<code translate="no">table_1_p1</code> ，也是一個向量表。<code translate="no">partition_name</code> 對應於<code translate="no">table_id</code> 。分区表中的字段继承自所有者表，其中<code translate="no">owner table</code> 字段指定所有者表的名称，<code translate="no">partition_tag</code> 字段指定分区的标记。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>表_新</span> </span></p>
<p>下表顯示 0.6.0 新增的欄位：</p>
<table>
<thead>
<tr><th style="text-align:left">欄位名稱</th><th style="text-align:left">資料類型</th><th style="text-align:left">說明</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">字串</td><td style="text-align:left">分區的父表。</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">字串</td><td style="text-align:left">分區的標籤。不得為空字串。</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">字串</td><td style="text-align:left">Milvus 版本。</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header"><code translate="no">TableFiles&quot;</code> 表中的欄位</h3><p>以下範例包含兩個檔案，都屬於<code translate="no">table_1</code> 向量表。第一個檔案的索引類型 (<code translate="no">engine_type</code>) 是 1 (FLAT)；檔案狀態 (<code translate="no">file_type</code>) 是 7 (原始檔案的備份)；<code translate="no">file_size</code> 是 411200113 位元組；向量行數是 200,000。第二個檔案的索引類型是 2 (IVFLAT)；檔案狀態是 3 (索引檔案)。第二個檔案實際上是第一個檔案的索引。我們會在接下來的文章中介紹更多資訊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>表檔案</span> </span></p>
<p>下表顯示<code translate="no">TableFiles</code> 的欄位和說明：</p>
<table>
<thead>
<tr><th style="text-align:left">欄位名稱</th><th style="text-align:left">資料類型</th><th style="text-align:left">說明</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">向量表的唯一識別碼。<code translate="no">id</code> 自動遞增。</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">字串</td><td style="text-align:left">向量表的名稱。</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">要為向量表建立的索引類型。預設為 0，表示無效索引。1 指定 FLAT。2 指定 IVFLAT。3 指定 IVFSQ8。4 指定 NSG。5 指定 IVFSQ8H。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">字串</td><td style="text-align:left">從檔案建立時間產生的檔案名稱。等於 1000 乘以從 1970 年 1 月 1 日到表格建立時間的毫秒數。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">檔案狀態。0 表示新產生的原始向量資料檔案。1 指定原始向量資料檔案。2 表示將為檔案建立索引。3 表示檔案是索引檔案。4 表示將刪除檔案（軟刪除）。5 指定檔案為新產生，用於儲存組合資料。6 指定該檔案為新產生，並用於儲存索引資料。7 指定原始向量資料檔案的備份狀態。</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">檔案大小（位元組）。</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">檔案中向量的數量。</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">最新更新時間的時間戳記，指定從 1970 年 1 月 1 日到資料表建立時間的毫秒數。</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">從 1970 年 1 月 1 日到資料表建立時間的毫秒數。</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">建立資料表的日期。由於歷史原因仍保留在此，將在未來版本中移除。</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">相關部落格<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">在大規模向量搜尋引擎中管理資料</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus 元資料管理 (1)：如何檢視元資料</a></li>
</ul>
