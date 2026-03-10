---
id: 2019-12-18-datafile-cleanup.md
title: Previous delete strategy and related problems
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: >-
  We improved the file delete strategy to fix the query operation related
  issues.
cover: null
tag: Engineering
---
<custom-h1>Improvements of the Data File Cleanup Mechanism</custom-h1><blockquote>
<p>author: Yihua Mo</p>
<p>Date: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">Previous delete strategy and related problems<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>In <a href="/blog/fr/2019-11-08-data-management.md">Managing Data in Massive-Scale Vector Search Engine</a>, we mentioned the delete mechanism of data files. Delete includes soft-delete and hard-delete. After performing a delete operation on a table, the table is marked with soft-delete. Search or update operations afterwards are no longer allowed. However, the query operation that starts before delete can still run. The table is really deleted together with metadata and other files only when the query operation is complete.</p>
<p>So, when the files marked with soft-delete are really deleted? Before 0.6.0, the strategy is that a file is really deleted after soft-deleted for 5 minutes. The following figure displays the strategy:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
    <span>5mins</span>
  </span>
</p>
<p>This strategy is based on the premise that queries normally do not last more than 5 minutes and is not reliable. If a query lasts more than 5 minutes, the query will fail. The reason is that when a query starts, Milvus collects information about files that can be searched and creates query tasks. Then, the query scheduler loads files to memory one by one and searches for files one by one. If a file no longer exists when loading a file, the query will fail.</p>
<p>Extending the time may help reduce the risk of query failures, but also causes another problem: disk usage is too large. The reason is that when large quantities of vectors are being inserted, Milvus continually combines data files and the combined files are not immediately removed from the disk, even though no query happens. If data insertion is too fast and/or the amount of inserted data is too large, extra disk usage can amount to tens of GBs. Refer to the following figure as an example:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
    <span>result</span>
  </span>
</p>
<p>As shown in the previous figure, the first batch of inserted data (insert_1) is flushed to disk and becomes file_1, then insert_2 becomes file_2. The thread responsible for file combination combines the files to file_3. Then, file_1 and file_2 are marked as soft-delete. The third batch of insert data becomes file_4. The thread combines file_3 and file_4 to file_5 and marks file_3 and file_4 as soft-delete.</p>
<p>Likewise, insert_6 and insert_5 are combined. In t3, file_5 and file_6 are marked as soft-delete. Between t3 and t4, although many files are marked as soft-delete, they are still in the disk. Files are really deleted after t4. Thus, between t3 and t4, the disk usage is 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB. The inserted data is 64 + 64 + 64 + 64 = 256 MB. The disk usage is 3 times the size of inserted data. The faster the write speed of the disk, the higher the disk usage during a specific time period.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">Improvements of the delete strategy in 0.6.0<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>Thus, we changed the strategy to delete files in v0.6.0. Hard-delete no longer uses time as triggers. Instead, the trigger is when the file is not in use by any task.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
    <span>newstrategy</span>
  </span>
</p>
<p>Assume two batches of vectors are inserted. In t1 a query request is given, Milvus acquires two files to be queried (file_1 and file_2, because file_3 still does not exist.) Then, the backend thread starts combining the two files with the query running at the same time. When file_3 is generated, file_1 and file_2 are marked as soft-delete. After the query, no other tasks will use file_1 and file_2, so they will be hard-deleted in t4. The interval between t2 and t4 is very small and depends on the interval of the query. In this way, unused files will be removed in time.</p>
<p>As for internal implementation, reference counting, which is familiar to software engineers, is used to determine whether a file can be hard-deleted. To explain using comparison, when a player has lives in a game, he can still play. When the number of lives becomes 0, the game is over. Milvus monitors the status of each file. When a file is used by a task, a life will be added to the file. When the file is no longer used, a life will be removed from the file. When a file is marked with soft-delete and the number of lives is 0, the file is ready for hard-delete.</p>
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
<li><a href="/blog/fr/2019-11-08-data-management.md">Managing Data in Massive-Scale Vector Search Engine</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Milvus Metadata Management (1): How to View Metadata</a></li>
<li><a href="/blog/fr/2019-12-27-meta-table.md">Milvus Metadata Management (2): Fields in the Metadata Table</a></li>
</ul>
