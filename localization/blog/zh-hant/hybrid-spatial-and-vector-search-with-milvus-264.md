---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: 如何使用 Milvus 混合空間與向量搜尋
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: 了解 Milvus 2.6.4 如何使用 Geometry 和 R-Tree 實現混合空間和向量搜尋，並提供效能深入分析和實用範例。
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>像「尋找 3 公里內的浪漫餐廳」這樣的查詢，聽起來很簡單。其實並不簡單，因為它結合了位置篩選和語意搜尋。大多數系統需要在兩個資料庫中分割此查詢，這意味著同步資料、在程式碼中合併結果，以及額外的延遲。</p>
<p><a href="https://milvus.io">Milvus</a>2.6.4 消除了這種分割。有了原生的<strong>GEOMETRY</strong>資料類型和<strong>R-Tree</strong>索引，Milvus 可以在單一查詢中同時應用位置和語意約束。這使得混合空間與語意搜尋變得更容易、更有效率。</p>
<p>本文將解釋為何需要這項變更，GEOMETRY 與 R-Tree 如何在 Milvus 中運作，預期的效能提升，以及如何使用 Python SDK 設定。</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">傳統地理與語意搜尋的限制<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>像「3 公里內的浪漫餐廳」這樣的查詢很難處理，原因有二：</p>
<ul>
<li><strong>"浪漫」需要語意搜尋。</strong>系統必須將餐廳評論和標籤向量化，然後在嵌入空間中以相似度尋找匹配。這只適用於向量資料庫。</li>
<li><strong>"3 公里內」需要空間篩選。</strong>搜尋結果必須限制在「使用者 3 公里範圍內」，有時甚至是「特定交付多邊形或行政邊界內」。</li>
</ul>
<p>在傳統架構中，滿足這兩種需求通常意味著要並列執行兩個系統：</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong>用於地理圍籬、距離計算和空間篩選。</li>
<li><strong>向量資料庫</strong>，用於嵌入式近似近鄰 (ANN) 搜尋。</li>
</ul>
<p>這種「雙資料庫」的設計造成了三個實際問題：</p>
<ul>
<li><strong>痛苦的資料同步。</strong>如果餐廳變更地址，您必須同時更新地理系統和向量資料庫。缺少一次更新就會產生不一致的結果。</li>
<li><strong>延遲時間較長。</strong>應用程式必須呼叫兩個系統並合併它們的輸出，增加了網路往返和處理時間。</li>
<li><strong>篩選效率低。</strong>如果系統先執行向量搜尋，通常會傳回許多距離使用者很遠的結果，因此必須在之後丟棄。如果先應用位置篩選，剩餘的結果集仍然很大，因此向量搜尋步驟仍然很昂貴。</li>
</ul>
<p>Milvus 2.6.4 將空間幾何支援直接加入向量資料庫，解決了這個問題。語意搜尋與位置篩選現在可在同一查詢中執行。由於一切都在一個系統中，混合搜尋更快、更容易管理。</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">GEOMETRY 對 Milvus 的新增功能<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 引入了一種稱為 DataType.GEOMETRY 的標量欄位類型。Milvus 現在不再以獨立的經緯度數字儲存位置，而是儲存幾何物件：點、線和多邊形。類似「這個點是否在某個區域內？」或「是否在 X 公尺範圍內？」的查詢變成原生操作。不需要在原始座標上建立變通。</p>
<p>本實作遵循<a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access 標準</strong>，因此可與大多數現有的地理空間工具搭配使用。幾何資料使用<strong>WKT（Well-Known Text）</strong>儲存與查詢，<strong>WKT</strong> 是人類可讀取、程式可解析的標準文字格式。</p>
<p>支援的幾何類型：</p>
<ul>
<li><strong>點</strong>：單一位置，例如商店地址或車輛的即時位置</li>
<li><strong>LINESTRING</strong>：一條線，例如道路中心線或移動路徑</li>
<li><strong>POLYGON</strong>：一個區域，例如行政邊界或地理圍籬。</li>
<li><strong>收集類型</strong>：MULTIPOINT、MULTILINESTRING、MULTIPOLYGON 及 GEOMETRYCOLLECTION。</li>
</ul>
<p>它也支援標準的空間運算符號，包括</p>
<ul>
<li><strong>空間關係</strong>：包含 (ST_CONTAINS、ST_WITHIN)、相交 (ST_INTERSECTS、ST_CROSSES) 及接觸 (ST_TOUCHES)</li>
<li><strong>距離操作</strong>：計算幾何物體之間的距離 (ST_DISTANCE) 以及篩選指定距離內的物件 (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">R-Tree 索引如何在 Milvus 內運作<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>幾何支援是內建在 Milvus 查詢引擎中，而不只是作為 API 功能。ISpatial 資料直接在引擎內使用 R-Tree (Rectangle Tree) 索引進行索引和處理。</p>
<p><strong>R-Tree</strong>使用<strong>最小邊界矩形 (MBR)</strong> 將附近的物件分組。在查詢過程中，引擎會跳過與查詢幾何圖形不重疊的大型區域，只對一小組候選物件執行詳細檢查。這比掃描每個物件要快得多。</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Milvus 如何建立 R-Tree</h3><p>R-Tree 的建構是分層進行的：</p>
<table>
<thead>
<tr><th><strong>層次</strong></th><th><strong>Milvus 的功能</strong></th><th><strong>直觀的比喻</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>葉層</strong></td><td>對於每個幾何物件 (點、線或多邊形)，Milvus 會計算其最小邊界矩形 (MBR)，並將其儲存為葉節點。</td><td>將每個物件包裝在一個完全符合它的透明方塊中。</td></tr>
<tr><td><strong>中間層級</strong></td><td>將鄰近的葉節點組合起來 (通常一次 50-100 個)，並建立一個較大的父 MBR，以涵蓋所有的葉節點。</td><td>將同一鄰近區域的包裹放進單一遞送箱。</td></tr>
<tr><td><strong>根層級</strong></td><td>此分組方式持續向上，直到單一根 MBR 涵蓋所有資料。</td><td>將所有板條箱裝上一輛長途卡車。</td></tr>
</tbody>
</table>
<p>有了這個結構，空間查詢複雜度就會從完整掃描的<strong>O(n)</strong>降到<strong>O(log n</strong> <strong>)</strong>。實際上，超過數百萬筆記錄的查詢可以從數百毫秒下降到幾毫秒，而不會降低精確度。</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">查詢如何執行：兩階段篩選</h3><p>為了在速度與正確性之間取得平衡，Milvus 採用了<strong>兩階段篩選</strong>策略：</p>
<ul>
<li><strong>粗略篩選：</strong>R-Tree 索引會先檢查查詢的邊界矩形是否與索引中的其他邊界矩形重疊。這會快速移除大部分不相關的資料，只保留一小部分候選資料。由於這些矩形都是簡單的形狀，因此檢查速度非常快，但可能會包含一些實際上並不匹配的結果。</li>
<li><strong>精細過濾</strong>：剩餘的候選結果會使用<strong>GEOS</strong> 進行檢查，<strong>GEOS</strong> 與 PostGIS 等系統所使用的幾何圖庫相同。GEOS 會執行精確的幾何計算，例如圖形是否相交或其中一個包含另一個，以產生正確的最終結果。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 接受<strong>WKT (Well-Known Text)</strong>格式的幾何資料，但內部儲存為<strong>WKB (Well-Known Binary)。</strong>WKB 更為精簡，可減少儲存空間並改進 I/O。GEOMETRY 欄位也支援記憶體映射 (mmap) 儲存，因此大型空間資料集不需要完全放在 RAM 中。</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">R-Tree 的效能提升<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">隨著資料成長，查詢延遲時間保持平穩。</h3><p>如果沒有 R-Tree 索引，查詢時間與資料大小呈線性比例 - 資料多 10 倍，查詢速度就慢 10 倍。</p>
<p>有了 R-Tree，查詢時間會以對數成長。在擁有數百萬筆記錄的資料集上，空間篩選的速度可比完整掃描快幾十倍到幾百倍。</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">不會為了速度而犧牲精確度</h3><p>R-Tree 會根據邊界區塊縮小候選資料的範圍，然後由 GEOS 以精確的幾何數學檢查每個候選資料。任何看似匹配但實際上在查詢區域之外的資料，都會在第二次掃描時被移除。</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">混合搜尋的吞吐量提升</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>R-Tree 會先移除目標區域以外的記錄。然後 Milvus 只在剩餘的候選項上執行向量相似性 (L2、IP 或余弦)。更少的候選記錄意味著更低的搜尋成本和更高的每秒查詢率 (QPS)。</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">入門：使用 Python SDK 的 GEOMETRY<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">定義集合並建立索引</h3><p>首先，在集合模式中定義一個 DataType.GEOMETRY 欄位。這允許 Milvus 儲存和查詢幾何資料。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">插入資料</h3><p>插入資料時，幾何值必須是 WKT (Well-Known Text) 格式。每條記錄包括幾何、向量和其他欄位。</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">執行混合空間-向量查詢（範例）</h3><p><strong>情境：</strong>尋找在向量空間中最相似且位於指定點 (例如使用者的位置) 2 公里範圍內的前 3 個 POI。</p>
<p>使用 ST_DWITHIN 運算子套用距離篩選器。距離值的指定單位為<strong>公尺。</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">生產使用提示<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>務必在 GEOMETRY 欄位上建立 R-Tree 索引。</strong>對於超過 10,000 個實體的資料集，沒有 RTREE 索引的空間篩選器會退回到完全掃描，效能會急速下降。</li>
<li><strong>使用一致的坐標系統。</strong>所有位置資料都必須使用相同的系統 (例如<a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>)。混合座標系會破壞距離和包含計算。</li>
<li><strong>為查詢選擇正確的空間運算符號。</strong>ST_DWITHIN 適用於「X 公尺以內」的搜尋。ST_CONTAINS 或 ST_WITHIN 用於地理圍籬和包含檢查。</li>
<li><strong>會自動處理 NULL 的幾何值。</strong>如果 GEOMETRY 欄位是 nullable (nullable=True)，Milvus 會在空間查詢時跳過 NULL 值。不需要額外的過濾邏輯。</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">部署要求<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>若要在生產中使用這些功能，請確定您的環境符合下列要求。</p>
<p><strong>1.Milvus 版本</strong></p>
<p>您必須執行<strong>Milvus 2.6.4 或更新版本</strong>。早期版本不支援 DataType.GEOMETRY 或<strong>RTREE</strong>索引類型。</p>
<p><strong>2.SDK 版本</strong></p>
<ul>
<li><strong>PyMilvus</strong>: 升級至最新版本 (建議使用<strong>2.6.x</strong>系列)。這是正確的 WKT 序列化和傳輸 RTREE 索引參數所必需的。</li>
<li><strong>Java / Go / Node SDK</strong>：檢查每個 SDK 的發行說明，並確認它們與<strong>2.6.4</strong>proto 定義一致。</li>
</ul>
<p><strong>3.內建幾何函式庫</strong></p>
<p>Milvus 伺服器已經包含 Boost.Geometry 和 GEOS，所以您不需要自己安裝這些函式庫。</p>
<p><strong>4.記憶體使用與容量規劃</strong></p>
<p>R-Tree 索引會使用額外的記憶體。在規劃容量時，請記得為幾何索引以及向量索引 (例如 HNSW 或 IVF) 做預算。GEOMETRY 欄位支援記憶體映射 (mmap) 儲存，可將部分資料保留在磁碟上，以減少記憶體使用量。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>基於位置的語意搜尋不僅需要在向量查詢上加上地理篩選器。它需要內建的空間資料類型、適當的索引，以及能夠同時處理位置與向量的查詢引擎。</p>
<p><strong>Milvus 2.6.4</strong>使用原生的<strong>GEOMETRY 欄位</strong>和<strong>R-Tree</strong>索引解決了這個問題。空間篩選和向量搜尋在單一查詢、單一資料儲存中執行。R-Tree 可處理快速的空間剪枝，而 GEOS 則可確保精確的結果。</p>
<p>對於需要位置感知檢索的應用程式而言，這消除了執行和同步兩個獨立系統的複雜性。</p>
<p>如果您正在進行位置感知或混合空間與向量搜尋，我們很樂意聽取您的經驗。</p>
<p><strong>對 Milvus 有問題嗎？</strong>加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>或預約 20 分鐘的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours 課程</a>。</p>
