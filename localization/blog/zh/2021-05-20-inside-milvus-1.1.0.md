---
id: inside-milvus-1.1.0.md
title: 新功能
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: Milvus v1.1.0 已发布！新功能、改进和错误修复现已发布。
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>走进 Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a>是一个正在进行中的开源软件 (OSS) 项目，致力于构建世界上最快、最可靠的向量数据库。得益于开源社区的长期支持和 Zilliz 的赞助，Milvus v1.1.0 中的新功能是众多更新中的第一个。这篇博客文章介绍了 Milvus v1.1.0 包含的新功能、改进和错误修复。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#new-features">新功能</a></li>
<li><a href="#improvements">改进</a></li>
<li><a href="#bug-fixes">错误修复</a></li>
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
    </button></h2><p>与其他开放源码软件项目一样，Milvus 也是一个不断进步的项目。我们努力倾听用户和开源社区的意见，优先考虑最重要的功能。最新更新版本 Milvus v1.1.0 提供了以下新功能：</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">使用<code translate="no">get_entity_by_id()</code> 方法调用指定分区</h3><p>为了进一步加速向量相似性搜索，Milvus 1.1.0 现在支持从指定分区检索向量。一般来说，Milvus 支持通过指定的向量 ID 查询向量。在 Milvus 1.0 中，调用方法<code translate="no">get_entity_by_id()</code> 会搜索整个 Collections，这对于大型数据集来说会比较耗时。从下面的代码中我们可以看到，<code translate="no">GetVectorsByIdHelper</code> 使用<code translate="no">FileHolder</code> 结构来循环查找特定的向量。</p>
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
<p>但是，这个结构并没有经过<code translate="no">FilesByTypeEx()</code> 中任何分区的过滤。在 Milvus v1.1.0 中，系统可以向<code translate="no">GetVectorsIdHelper</code> 循环传递分区名称，这样<code translate="no">FileHolder</code> 就只包含指定分区的数据段。换句话说，如果你确切地知道用于搜索的向量属于哪个分区，就可以在<code translate="no">get_entity_by_id()</code> 方法调用中指定分区名称，从而加速搜索过程。</p>
<p>我们不仅修改了 Milvus 服务器层控制系统查询的代码，还更新了我们所有的 SDK（Python、Go、C++、Java 和 RESTful），增加了一个用于指定分区名称的参数。例如，在 pymilvus 中，<code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> 的定义更改为<code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code> 。</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">使用<code translate="no">delete_entity_by_id()</code> 方法调用指定分区</h3><p>为了提高向量管理的效率，Milvus v1.1.0 现在支持在删除 Collections 中的向量时指定分区名称。在 Milvus 1.0 中，只能通过 ID 删除 Collections 中的向量。调用删除方法时，Milvus 会扫描集合中的所有向量。不过，在处理百万、十亿甚至万亿向量数据集时，只扫描相关分区的效率要高得多。与使用<code translate="no">get_entity_by_id()</code> 方法调用指定分区的新功能类似，我们使用相同的逻辑对 Milvus 代码进行了修改。</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">新方法<code translate="no">release_collection()</code></h3><p>为了释放 Milvus 用于在运行时加载 Collections 的内存，Milvus v1.1.0 中添加了一个新方法<code translate="no">release_collection()</code> ，用于从缓存中手动卸载特定的 Collections。</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">改进<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然新功能通常都很流行，但改进已有功能也很重要。以下是与 Milvus v1.0 相比的升级和其他一般改进。</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">提高<code translate="no">get_entity_by_id()</code> 方法调用的性能</h3><p>下图是 Milvus v1.0 和 Milvus v1.1.0 的向量搜索性能比较：</p>
<blockquote>
<p>CPU：英特尔® 酷睿™ i7-8550U CPU @ 1.80GHz * 8<br/>段文件大小 = 1024 MB<br/>行数 = 1,000,000<br/>尺寸 = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">查询 ID 编号</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 毫秒</td><td style="text-align:center">2 毫秒</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 毫秒</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib 升级至 v0.5.0</h3><p>Milvus 采用了多个广泛使用的索引库，包括 Faiss、NMSLIB、Hnswlib 和 Annoy，以简化为特定场景选择正确索引类型的过程。</p>
<p>在 Milvus 1.1.0 中，Hnswlib 已从 v0.3.0 升级到 v0.5.0，原因是在早期版本中发现了一个错误。此外，升级 Hnswlib 还提高了<code translate="no">addPoint()</code> 在索引构建中的性能。</p>
<p>一位 Zilliz 开发人员创建了一个拉取请求 (PR)，以改善 Hnswlib 在 Milvus 中构建索引时的性能。详情请参见<a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a>。</p>
<p>下图是 Hnswlib 0.5.0 与 PR 建议的<code translate="no">addPoint()</code> 性能比较：</p>
<blockquote>
<p>CPU：Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>数据集：sift_1M（行数 = 1000000，维数 = 128，空间 = L2</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16，ef_construction = 100</td><td style="text-align:center">274406 毫秒</td><td style="text-align:center">265631 ms</td></tr>
<tr><td style="text-align:center">M = 16, ef_construction = 200</td><td style="text-align:center">522411 毫秒</td><td style="text-align:center">499639 毫秒</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">改进的 IVF 索引训练性能</h3><p>创建索引包括训练、插入和将数据写入磁盘。Milvus 1.1.0 改进了索引构建的训练部分。下图是 Milvus 1.0 和 Milvus 1.1.0 的 IVF 索引训练性能比较：</p>
<blockquote>
<p>CPU：Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>数据集：sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
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
<h2 id="Bug-fixes" class="common-anchor-header">错误修正<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>我们还修复了一些错误，使 Milvus 在管理向量数据集时更稳定、更高效。更多详情，请参阅 "<a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">已修复问题</a>"。</p>
