---
id: inside-milvus-1.1.0.md
title: 새로운 기능
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: 'Milvus v1.1.0이 출시되었습니다! 새로운 기능, 개선 사항 및 버그 수정이 적용되었습니다.'
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Milvus 1.1.0 내부</custom-h1><p><a href="https://github.com/milvus-io">Milvus는</a> 세계에서 가장 빠르고 안정적인 벡터 데이터베이스를 구축하는 데 초점을 맞춘 지속적인 오픈 소스 소프트웨어(OSS) 프로젝트입니다. Milvus 1.1.0의 새로운 기능은 오픈 소스 커뮤니티의 장기적인 지원과 Zilliz의 후원 덕분에 앞으로 제공될 많은 업데이트 중 첫 번째 업데이트입니다. 이 블로그 문서에서는 Milvus v1.1.0에 포함된 새로운 기능, 개선 사항 및 버그 수정 사항을 다룹니다.</p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#new-features">새로운 기능</a></li>
<li><a href="#improvements">개선 사항</a></li>
<li><a href="#bug-fixes">버그 수정</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">새로운 기능<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>다른 OSS 프로젝트와 마찬가지로 Milvus는 끊임없이 진행 중인 작업입니다. 저희는 사용자와 오픈소스 커뮤니티의 의견을 경청하여 가장 중요한 기능의 우선순위를 정하기 위해 노력하고 있습니다. 최신 업데이트인 Milvus v1.1.0은 다음과 같은 새로운 기능을 제공합니다:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header"><code translate="no">get_entity_by_id()</code> 메서드 호출로 파티션 지정</h3><p>벡터 유사도 검색을 더욱 가속화하기 위해 Milvus 1.1.0은 이제 지정된 파티션에서 벡터를 검색하는 기능을 지원합니다. 일반적으로 Milvus는 지정된 벡터 ID를 통해 벡터를 쿼리하는 기능을 지원합니다. Milvus 1.0에서는 <code translate="no">get_entity_by_id()</code> 메서드를 호출하면 전체 컬렉션을 검색하므로 대규모 데이터 세트의 경우 시간이 많이 소요될 수 있습니다. 아래 코드에서 볼 수 있듯이 <code translate="no">GetVectorsByIdHelper</code> 은 <code translate="no">FileHolder</code> 구조를 사용하여 특정 벡터를 반복하여 찾습니다.</p>
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
<p>그러나 이 구조는 <code translate="no">FilesByTypeEx()</code> 의 파티션에 의해 필터링되지 않습니다. Milvus v1.1.0에서는 시스템이 <code translate="no">GetVectorsIdHelper</code> 루프에 파티션 이름을 전달하여 <code translate="no">FileHolder</code> 에 지정된 파티션의 세그먼트만 포함하도록 할 수 있습니다. 달리 말하면, 검색할 벡터가 어느 파티션에 속하는지 정확히 알고 있다면 <code translate="no">get_entity_by_id()</code> 메서드 호출에서 파티션 이름을 지정하여 검색 프로세스를 가속화할 수 있습니다.</p>
<p>Milvus 서버 수준에서 시스템 쿼리를 제어하는 코드를 수정했을 뿐만 아니라 모든 SDK(Python, Go, C++, Java, RESTful)에 파티션 이름을 지정하는 파라미터를 추가하여 업데이트했습니다. 예를 들어, pymilvus에서는 <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> 의 정의가 <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code> 로 변경됩니다.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header"><code translate="no">delete_entity_by_id()</code> 메서드 호출로 파티션 지정</h3><p>벡터 관리를 보다 효율적으로 하기 위해 Milvus v1.1.0에서는 이제 컬렉션에서 벡터를 삭제할 때 파티션 이름을 지정하는 기능이 지원됩니다. Milvus 1.0에서는 컬렉션의 벡터를 ID별로만 삭제할 수 있습니다. 삭제 메서드를 호출할 때 Milvus는 컬렉션의 모든 벡터를 스캔합니다. 그러나 백만, 억 또는 조 단위의 대규모 벡터 데이터 세트로 작업할 때는 관련 파티션만 스캔하는 것이 훨씬 더 효율적입니다. <code translate="no">get_entity_by_id()</code> 메서드 호출로 파티션을 지정하는 새로운 기능과 유사하게, 동일한 로직을 사용해 Milvus 코드도 수정되었습니다.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">새로운 메서드 <code translate="no">release_collection()</code></h3><p>Milvus가 런타임에 컬렉션을 로드하는 데 사용하는 메모리를 확보하기 위해 Milvus v1.1.0에 캐시에서 특정 컬렉션을 수동으로 언로드하는 새로운 메서드 <code translate="no">release_collection()</code> 가 추가되었습니다.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">개선 사항<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>새로운 기능이 대세인 요즘이지만, 이미 있는 기능을 개선하는 것도 중요합니다. 다음은 Milvus v1.0에 대한 업그레이드 및 기타 일반적인 개선 사항입니다.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header"><code translate="no">get_entity_by_id()</code> 메서드 호출의 성능 개선</h3><p>아래 차트는 Milvus v1.0과 Milvus v1.1.0의 벡터 검색 성능을 비교한 것입니다:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>세그먼트 파일 크기 = 1024MB <br/>행 수 = 1,000,000 <br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">쿼리 ID 번호</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149ms</td><td style="text-align:center">19ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib v0.5.0으로 업그레이드됨</h3><p>Milvus는 주어진 시나리오에 적합한 인덱스 유형을 선택하는 프로세스를 간소화하기 위해 Faiss, NMSLIB, Hnswlib, Annoy 등 널리 사용되는 여러 인덱스 라이브러리를 채택하고 있습니다.</p>
<p>이전 버전에서 발견된 버그로 인해 Milvus 1.1.0에서 Hnswlib가 v0.3.0에서 v0.5.0으로 업그레이드되었습니다. 또한 Hnswlib를 업그레이드하면 인덱스 구축에서 <code translate="no">addPoint()</code> 성능이 향상됩니다.</p>
<p>한 Zilliz 개발자가 Milvus에서 인덱스를 구축하는 동안 Hnswlib 성능을 개선하기 위해 풀 리퀘스트(PR)를 만들었습니다. 자세한 내용은 <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298을</a> 참조하세요.</p>
<p>아래 차트는 Hnswlib 0.5.0과 제안된 PR 사이의 <code translate="no">addPoint()</code> 성능을 비교한 것입니다:</p>
<blockquote>
<p>CPU: 인텔® 코어™ i7-8550U CPU @ 1.80GHz * 8 <br/>데이터 세트: sift_1M(행 수 = 1000000, dim = 128, 공간 = L2)</p>
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
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">IVF 인덱스 훈련 성능 개선</h3><p>인덱스 생성에는 학습, 디스크에 데이터 삽입 및 쓰기가 포함됩니다. Milvus 1.1.0은 인덱스 구축의 훈련 구성 요소를 개선했습니다. 아래 차트는 Milvus 1.0과 Milvus 1.1.0의 IVF 인덱스 훈련 성능을 비교한 것입니다:</p>
<blockquote>
<p>CPU: 인텔® 코어™ i7-8550U CPU @ 1.80GHz * 8 <br/>데이터 세트: sift_1m(row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (ms)</th><th style="text-align:center">v1.1.0 (ms)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">IVF_FLAT (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">IVF_PQ (nlist = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">IVF_PQ (NLIST = 2048, M=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">IVF_FLAT (nlist = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">IVF_PQ (nlist = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">IVF_PQ (NLIST = 4096, M=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">버그 수정<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터셋을 보다 안정적이고 효율적으로 관리할 수 있도록 몇 가지 버그도 수정했습니다. 자세한 내용은 <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">수정된 문제를</a> 참조하세요.</p>
