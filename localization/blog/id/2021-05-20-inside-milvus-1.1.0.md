---
id: inside-milvus-1.1.0.md
title: New features
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  Milvus v1.1.0 has arrived! New features, improvements, and bug fixes are
  available now.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Inside Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> is an ongoing open-source software (OSS) project focused on building the world’s fastest and most reliable vector database. New features inside Milvus v1.1.0 are the first of many updates to come, thanks to long-term support from the open-source community and sponsorship from Zilliz. This blog article covers the new features, improvements, and bug fixes included with Milvus v1.1.0.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#new-features">New features</a></li>
<li><a href="#improvements">Improvements</a></li>
<li><a href="#bug-fixes">Bug fixes</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">New features<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Like any OSS project, Milvus is a perpetual work in progress. We strive to listen to our users and the open-source community to prioritize the features that matter most. The latest update, Milvus v1.1.0, offers the following new features:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Specify partitions with <code translate="no">get_entity_by_id()</code> method calls</h3><p>To further accelerate vector similarity search, Milvus 1.1.0 now supports retrieving vectors from a specified partition. Generally, Milvus supports querying vectors through specified vector IDs. In Milvus 1.0, calling the method <code translate="no">get_entity_by_id()</code> searches the entire collection, which can be time consuming for large datasets. As we can see from the code below, <code translate="no">GetVectorsByIdHelper</code> uses a <code translate="no">FileHolder</code> structure to loop through and find a specific vector.</p>
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
<p>However, this structure is not filtered by any partitions in <code translate="no">FilesByTypeEx()</code>. In Milvus v1.1.0, it is possible for the system to pass partition names to the <code translate="no">GetVectorsIdHelper</code> loop so that the <code translate="no">FileHolder</code> only contains segments from specified partitions. Put differently, if you know exactly which partition the vector for a search belongs to, you can specify the partition name in a <code translate="no">get_entity_by_id()</code> method call to accelerate the search process.</p>
<p>We not only made modifications to code controlling system queries at the Milvus server level, but also updated all our SDKs(Python, Go, C++, Java, and RESTful) by adding a parameter for specifying partition names. For example, in pymilvus, the definition of <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> is changed to <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Specify partitions with <code translate="no">delete_entity_by_id()</code> method calls</h3><p>To make vector management more efficient, Milvus v1.1.0 now supports specifying partition names when deleting a vector in a collection. In Milvus 1.0, vectors in a collection can only be deleted by ID. When calling the delete method, Milvus will scan all vectors in the collection. However, it is far more efficient to scan only relevant partitions when working with massive million, billion, or even trillion vector datasets. Similar to the new feature for specifying partitions with <code translate="no">get_entity_by_id()</code> method calls, modifications were made to the Milvus code using the same logic.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">New method <code translate="no">release_collection()</code></h3><p>To free up memory Milvus used to load collections at runtime, a new method <code translate="no">release_collection()</code> has been added in Milvus v1.1.0 to manually unload specific collections from cache.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Improvements<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Although new features are usually all the rage, it’s also important to improve what we already have. What follows are upgrades and other general improvements over Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Improved performance of <code translate="no">get_entity_by_id()</code> method call</h3><p>The chart below is a comparison of vector search performance between Milvus v1.0 and Milvus v1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>
Segment file size = 1024 MB <br/>
Row count = 1,000,000 <br/>
Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">Query ID Num</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 ms</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib upgraded to v0.5.0</h3><p>Milvus adopts multiple widely used index libraries, including Faiss, NMSLIB, Hnswlib, and Annoy to simplify the process of choosing the right index type for a given scenario.</p>
<p>Hnswlib has been upgraded from v0.3.0 to v0.5.0 in Milvus 1.1.0 due to a bug detected in the earlier version. Additionally, upgrading Hnswlib improves <code translate="no">addPoint()</code> performance in index building.</p>
<p>A Zilliz developer created a pull request (PR) to improve Hnswlib performance while building indexes in Milvus. See <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> for details.</p>
<p>The chart below is a comparison of <code translate="no">addPoint()</code> performance between Hnswlib 0.5.0 and the proposed PR:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>
Dataset: sift_1M (row count = 1000000, dim = 128, space = L2)</p>
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
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Improved IVF index training performance</h3><p>Creating an index includes training, inserting and writing data to disk. Milvus 1.1.0 improves the training component of index building. The chart below is a comparison of IVF index training performance between Milvus 1.0 and Milvus 1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>
Dataset: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
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
<h2 id="Bug-fixes" class="common-anchor-header">Bug fixes<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>We also fixed some bugs to make Milvus more stable and efficient when managing vector datasets. See <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">Fixed Issues</a> for more details.</p>
