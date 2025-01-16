---
id: inside-milvus-1.1.0.md
title: 新功能
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: Milvus v1.1.0 已經到來！新功能、改進與錯誤修復現已推出。
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Milvus 1.1.0 內容</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a>是一個持續進行中的開放原始碼軟體 (OSS) 專案，專注於建立全球最快、最可靠的向量資料庫。由於開源社群的長期支持以及 Zilliz 的贊助，Milvus v1.1.0 的新功能是眾多更新中的第一個。這篇部落格文章涵蓋 Milvus v1.1.0 所包含的新功能、改進與錯誤修正。</p>
<p><strong>跳至</strong></p>
<ul>
<li><a href="#new-features">新功能</a></li>
<li><a href="#improvements">改進</a></li>
<li><a href="#bug-fixes">錯誤修正</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">新功能<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>就像任何 OSS 專案一樣，Milvus 是一個永遠在進步中的工作。我們努力傾聽用戶和開源社群的意見，優先處理最重要的功能。最新更新版本 Milvus v1.1.0 提供以下新功能：</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">以<code translate="no">get_entity_by_id()</code> 方法呼叫指定分區</h3><p>為了進一步加速向量相似性搜尋，Milvus 1.1.0 現在支援從指定的分割區檢索向量。一般而言，Milvus 支援透過指定向量 ID 來查詢向量。在 Milvus 1.0 中，呼叫方法<code translate="no">get_entity_by_id()</code> 會搜尋整個集合，這對於大型資料集來說可能很花時間。我們可以從下面的程式碼看到，<code translate="no">GetVectorsByIdHelper</code> 使用<code translate="no">FileHolder</code> 結構來迴圈尋找特定向量。</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">FilesByTypeEx()</code>在 Milvus v1.1.0 中，系統可以傳送分區名稱到<code translate="no">GetVectorsIdHelper</code> 環路，這樣<code translate="no">FileHolder</code> 就只包含指定分區的區段。換句話說，如果您確切知道要搜尋的向量屬於哪個分割區，您可以在<code translate="no">get_entity_by_id()</code> 方法呼叫中指定分割區名稱，以加速搜尋過程。</p>
<p>我們不僅修改了 Milvus 伺服器層級控制系統查詢的程式碼，也更新了所有 SDK (Python、Go、C++、Java 及 RESTful)，加入了指定分割區名稱的參數。例如，在 pymilvus 中，<code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> 的定義變為<code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code> 。</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">使用<code translate="no">delete_entity_by_id()</code> 方法呼叫指定分割區</h3><p>為了讓向量管理更有效率，Milvus v1.1.0 現在支援在刪除集合中的向量時指定分割區名稱。在 Milvus 1.0 中，集合中的向量只能透過 ID 刪除。當呼叫 delete 方法時，Milvus 會掃描集合中的所有向量。然而，在處理數百萬、十億甚至上兆向量資料集時，只掃描相關的分區會更有效率。與<code translate="no">get_entity_by_id()</code> 方法呼叫指定分區的新功能類似，使用相同的邏輯修改 Milvus 程式碼。</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">新方法<code translate="no">release_collection()</code></h3><p>為了釋放 Milvus 用來在執行時載入集合的記憶體，Milvus v1.1.0 加入了一個新方法<code translate="no">release_collection()</code> ，用來手動從快取記憶體卸載特定集合。</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">改進<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>儘管新功能通常是最流行的，但改善我們已有的功能也是很重要的。以下是與 Milvus v1.0 相比的升級和其他一般改進。</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">改善<code translate="no">get_entity_by_id()</code> 方法呼叫的效能</h3><p>下圖是 Milvus v1.0 和 Milvus v1.1.0 的向量搜尋效能比較：</p>
<blockquote>
<p>CPU：Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>Segment file size = 1024 MB<br/>Row count = 1,000,000<br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">查詢 ID 編號</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 毫秒</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 毫秒</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib 升級至 v0.5.0</h3><p>Milvus 採用多個廣泛使用的索引函式庫，包括 Faiss、NMSLIB、Hnswlib 和 Annoy，以簡化針對特定情況選擇適當索引類型的過程。</p>
<p>在 Milvus 1.1.0 中，Hnswlib 已從 v0.3.0 升級至 v0.5.0，這是由於在早期版本中發現了一個錯誤。此外，升級 Hnswlib 也改善了<code translate="no">addPoint()</code> 在建立索引時的效能。</p>
<p>一位 Zilliz 開發人員建立了一個 pull request (PR) 來改善 Hnswlib 在 Milvus 中建立索引時的效能。詳情請參閱<a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a>。</p>
<p>下圖為 Hnswlib 0.5.0 與 PR 建議的<code translate="no">addPoint()</code> 效能比較：</p>
<blockquote>
<p>CPU：Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>資料集：sift_1M (row count = 1000000, dim = 128, space = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16, ef_construction = 100</td><td style="text-align:center">274406 ms</td><td style="text-align:center">265631 ms</td></tr>
<tr><td style="text-align:center">M = 16, ef_construction = 200</td><td style="text-align:center">522411 ms</td><td style="text-align:center">499639 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">改進的 IVF 索引訓練效能</h3><p>建立索引包括訓練、插入和寫入資料到磁碟。Milvus 1.1.0 改善了索引建立的訓練部分。下圖是 Milvus 1.0 和 Milvus 1.1.0 的 IVF 索引訓練效能比較：</p>
<blockquote>
<p>CPU：Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>資料集：sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (ms)</th><th style="text-align:center">v1.1.0 (ms)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flat (nlist = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">錯誤修正<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>我們也修正了一些錯誤，讓 Milvus 在管理向量資料集時更穩定、更有效率。詳情請參閱<a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">修正的問題</a>。</p>
