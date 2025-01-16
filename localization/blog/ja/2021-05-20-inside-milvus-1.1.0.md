---
id: inside-milvus-1.1.0.md
title: 新機能
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: Milvus v1.1.0がリリースされました！新機能、改善、バグフィックスが利用可能になりました。
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>インサイド Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvusは</a>、世界で最も高速で信頼性の高いベクトルデータベースを構築することに焦点を当てた、進行中のオープンソースソフトウェア（OSS）プロジェクトです。Milvus v1.1.0内の新機能は、オープンソースコミュニティからの長期的なサポートとZillizからのスポンサーシップのおかげで、今後予定されている多くのアップデートの最初のものです。このブログでは、Milvus v1.1.0に含まれる新機能、改善点、バグ修正について説明します。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#new-features">新機能</a></li>
<li><a href="#improvements">改善点</a></li>
<li><a href="#bug-fixes">バグ修正</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">新機能<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>他のOSSプロジェクトと同様に、Milvusは永久に進行中の作業です。ユーザーやオープンソースコミュニティの声に耳を傾け、最も重要な機能に優先順位をつけるよう努めています。Milvus v1.1.0では、以下の新機能が追加されました：</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header"><code translate="no">get_entity_by_id()</code> メソッド呼び出しによるパーティションの指定</h3><p>ベクトル類似検索のさらなる高速化のため、Milvus 1.1.0では指定したパーティションからのベクトル検索に対応しました。通常、Milvusは指定したベクトルIDからベクトルを検索することができます。Milvus1.0では、<code translate="no">get_entity_by_id()</code> のメソッドを呼び出すとコレクション全体を検索するため、大規模なデータセットでは時間がかかります。以下のコードからわかるように、<code translate="no">GetVectorsByIdHelper</code> は<code translate="no">FileHolder</code> 構造体を使用してループを通し、特定のベクトルを検索します。</p>
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
<p><code translate="no">FilesByTypeEx()</code>Milvus v1.1.0では、<code translate="no">GetVectorsIdHelper</code> のループにパーティション名を渡すことで、<code translate="no">FileHolder</code> に指定したパーティションのセグメントのみが含まれるようにすることができます。別の言い方をすれば、検索対象のベクターがどのパーティションに属するかを正確に知っている場合、<code translate="no">get_entity_by_id()</code> メソッド呼び出しでパーティション名を指定することで、検索処理を高速化することができます。</p>
<p>Milvusサーバーレベルでシステムクエリを制御するコードに修正を加えただけでなく、パーティション名を指定するパラメーターを追加することで、すべてのSDK（Python、Go、C++、Java、RESTful）を更新しました。例えば、pymilvusでは、<code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> の定義が<code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code> に変更されています。</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header"><code translate="no">delete_entity_by_id()</code> メソッド呼び出しでパーティションを指定</h3><p>Milvus v1.1.0では、ベクタの管理をより効率的にするために、コレクション内のベクタを削除する際にパーティション名を指定できるようになりました。Milvus1.0では、コレクション内のベクターはIDでしか削除できませんでした。削除メソッドを呼び出すと、Milvusはコレクション内のすべてのベクターをスキャンします。しかし、100万、10億、あるいは1兆という巨大なベクトルデータセットを扱う場合、関連するパーティションのみをスキャンする方がはるかに効率的です。<code translate="no">get_entity_by_id()</code> メソッド呼び出しでパーティションを指定する新機能と同様に、同じロジックを用いてMilvusコードに修正を加えました。</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">新メソッド<code translate="no">release_collection()</code></h3><p>Milvus v1.1.0では、実行時にコレクションをロードするために使用していたメモリを解放するために、キャッシュから特定のコレクションを手動でアンロードするための新しいメソッド<code translate="no">release_collection()</code> が追加されました。</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">改良点<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>通常、新機能は大流行ですが、既にあるものを改善することも重要です。以下は、Milvus v1.0からのアップグレードとその他の一般的な改善点です。</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header"><code translate="no">get_entity_by_id()</code> メソッド呼び出しのパフォーマンス向上</h3><p>下のグラフは、Milvus v1.0とMilvus v1.1.0のベクトル検索性能の比較です：</p>
<blockquote>
<p>CPU：CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>セグメントファイルサイズ = 1024 MB<br/>行数 = 1,000,000<br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">クエリーID番号</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 ms</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlibをv0.5.0にアップグレード</h3><p>Milvusは、Faiss、NMSLIB、Hnswlib、Annoyなど、広く使用されている複数のインデックスライブラリを採用し、特定のシナリオに適したインデックスタイプを選択するプロセスを簡素化しています。</p>
<p>Milvus1.1.0では、Hnswlibがv0.3.0からv0.5.0にアップグレードされました。さらに、Hnswlibをアップグレードすることで、インデックス構築における<code translate="no">addPoint()</code> パフォーマンスが改善されました。</p>
<p>Milvusでインデックスを構築する際のHnswlibのパフォーマンスを改善するために、Zillizの開発者がプルリクエスト(PR)を作成しました。詳細は<a href="https://github.com/nmslib/hnswlib/pull/298">PR #298を</a>参照してください。</p>
<p>以下のグラフは、Hnswlib 0.5.0と提案されたPRとの<code translate="no">addPoint()</code> パフォーマンスの比較です：</p>
<blockquote>
<p>CPU：Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>Dataset: sift_1M (row count = 1000000, dim = 128, space = L2)</p>
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
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">IVFインデックスのトレーニング性能の向上</h3><p>インデックスの作成には、トレーニング、データの挿入、ディスクへの書き込みが含まれます。Milvus1.1.0では、インデックス作成のトレーニングコンポーネントが改善されました。以下のチャートは、Milvus 1.0とMilvus 1.1.0のIVFインデックストレーニング性能の比較です：</p>
<blockquote>
<p>CPU：Intel® Core™ i7-8550U CPU @ 1.80GHz * 8<br/>Dataset: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
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
<h2 id="Bug-fixes" class="common-anchor-header">バグ修正<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusがベクトルデータセットを管理する際に、より安定的かつ効率的になるようにいくつかのバグを修正しました。詳しくは<a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">修正された問題を</a>ご覧ください。</p>
