---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: 如何使用 Milvus 混合空间和向量搜索
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
desc: 了解 Milvus 2.6.4 如何使用几何和 R-Tree 实现混合空间和向量搜索，并提供性能见解和实际示例。
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>像 "查找 3 公里内的浪漫餐厅 "这样的查询听起来很简单。其实不然，因为它结合了位置过滤和语义搜索。大多数系统都需要在两个数据库中分拆这一查询，这意味着同步数据、在代码中合并结果以及额外的延迟。</p>
<p><a href="https://milvus.io">Milvus</a>2.6.4 消除了这种分割。通过本地<strong>GEOMETRY</strong>数据类型和<strong>R-Tree</strong>索引，Milvus 可以在单个查询中同时应用位置和语义约束。这使得混合空间和语义搜索变得更容易、更高效。</p>
<p>本文将解释为什么需要这一改变，GEOMETRY 和 R-Tree 在 Milvus 中是如何工作的，预期会有哪些性能提升，以及如何使用 Python SDK 进行设置。</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">传统地理和语义搜索的局限性<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>像 "3 公里内的浪漫餐厅 "这样的查询很难处理，原因有两个：</p>
<ul>
<li><strong>"浪漫 "需要语义搜索。</strong>系统必须将餐厅评论和标签向量化，然后在 Embeddings 空间中通过相似度查找匹配。这只适用于向量数据库。</li>
<li><strong>"3公里以内 "需要空间过滤。</strong>搜索结果必须限制在 "用户周围 3 公里内"，有时甚至是 "特定的交付多边形或行政边界内"。</li>
</ul>
<p>在传统架构中，满足这两种需求通常意味着并行运行两个系统：</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong>用于地理围栏、距离计算和空间过滤。</li>
<li><strong>向量数据库</strong>，用于在 Embeddings 上进行近似近邻（ANN）搜索。</li>
</ul>
<p>这种 "双数据库 "设计产生了三个实际问题：</p>
<ul>
<li><strong>痛苦的数据同步。</strong>如果一家餐厅更改了地址，就必须同时更新地理系统和向量数据库。缺少一次更新就会产生不一致的结果。</li>
<li><strong>延迟更长。</strong>应用程序必须调用两个系统并合并它们的输出，从而增加了网络往返和处理时间。</li>
<li><strong>过滤效率低。</strong>如果系统先运行向量搜索，往往会返回许多离用户很远的结果，之后不得不丢弃。如果先应用位置过滤，剩余的结果集仍然很大，因此向量搜索步骤的成本仍然很高。</li>
</ul>
<p>Milvus 2.6.4 通过在向量数据库中直接添加空间几何支持解决了这个问题。现在，语义搜索和位置过滤在同一个查询中运行。由于所有功能都在一个系统中，混合搜索变得更快、更易于管理。</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">GEOMETRY 为 Milvus 带来的新功能<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 引入了一种名为 DataType.GEOMETRY 的标量字段类型。Milvus 现在不再以单独的经度和纬度数字来存储位置，而是存储几何对象：点、线和多边形。像 "这个点在某个区域内吗？"或 "它在 X 米以内吗？"这样的查询就变成了本地操作符。无需在原始坐标上建立变通方法。</p>
<p>它的实现遵循<a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS 简单地物访问标准</strong>，因此能与大多数现有的地理空间工具配合使用。几何数据使用<strong>WKT（Well-Known Text）</strong>存储和查询，这是一种标准文本格式，人类可读，程序可解析。</p>
<p>支持的几何类型</p>
<ul>
<li><strong>点</strong>：单个位置，如商店地址或车辆的实时位置</li>
<li><strong>线段</strong>：一条线，如道路中心线或移动路径</li>
<li><strong>多边形</strong>：区域，如行政边界或地理围栏</li>
<li><strong>收集类型</strong>：多点（MULTIPOINT）、多线跟踪（MULTILINESTRING）、多多边形（MULTIPOLYGON）和几何集合（GEOMETRYCOLLECTION）。</li>
</ul>
<p>它还支持标准空间操作符，包括</p>
<ul>
<li><strong>空间关系</strong>：包含（ST_CONTAINS、ST_WITHIN）、交叉（ST_INTERSECTS、ST_CROSSES）和接触（ST_TOUCHES）</li>
<li><strong>距离操作</strong>：计算几何体之间的距离（ST_DISTANCE）和过滤给定距离内的对象（ST_DWITHIN）</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">R 树索引如何在 Milvus 内部工作<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus查询引擎内置了几何支持，而不仅仅是作为应用程序接口（API）功能。ISpatial 数据直接在引擎内部使用 R-Tree（矩形树）索引进行索引和处理。</p>
<p><strong>R-Tree</strong>使用<strong>最小边界矩形（MBR）</strong>对附近的对象进行分组。在查询过程中，引擎会跳过与查询几何图形不重叠的大区域，只对一小部分候选对象进行详细检查。这比扫描每个对象要快得多。</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Milvus 如何构建 R 树</h3><p>R 树的构建是分层进行的：</p>
<table>
<thead>
<tr><th><strong>层次</strong></th><th><strong>Milvus 的作用</strong></th><th><strong>直观类比</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>树叶层</strong></td><td>对于每个几何对象（点、线或多边形），Milvus 都会计算其最小边界矩形 (MBR)，并将其存储为叶节点。</td><td>将每个对象包裹在一个完全适合它的透明框中。</td></tr>
<tr><td><strong>中间层</strong></td><td>将附近的叶节点分组（通常每次 50-100 个），并创建一个更大的父级 MBR 以覆盖所有叶节点。</td><td>将同一小区的包裹装入一个快递箱。</td></tr>
<tr><td><strong>根级</strong></td><td>这种分组一直向上进行，直到单个根 MBR 覆盖所有数据。</td><td>将所有箱子装上一辆长途卡车。</td></tr>
</tbody>
</table>
<p>有了这种结构，空间查询的复杂度就会从完整扫描的<strong>O(n)</strong>降到<strong>O(log n</strong> <strong>)</strong>。在实践中，对数百万条记录的查询可以从数百毫秒缩短到几毫秒，而不会降低准确性。</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">查询如何执行：两阶段过滤</h3><p>为了兼顾速度和正确性，Milvus 采用了<strong>两阶段过滤</strong>策略：</p>
<ul>
<li><strong>粗略过滤：</strong>R 树索引首先检查查询的边界矩形是否与索引中的其他边界矩形重叠。这样可以快速删除大部分不相关的数据，只保留一小部分候选数据。由于这些矩形形状简单，因此检查速度非常快，但可能会包含一些实际上不匹配的结果。</li>
<li><strong>精细过滤</strong>：然后使用<strong>GEOS</strong>（与 PostGIS 等系统使用的几何库相同）检查剩余的候选结果。GEOS 会进行精确的几何计算，如形状是否相交或一个包含另一个，以生成正确的最终结果。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 接受<strong>WKT（Well-Known Text）</strong>格式的几何数据，但内部存储为<strong>WKB（Well-Known Binary）</strong>格式<strong>。</strong>WKB 格式更紧凑，可减少存储空间并改善 I/O。GEOMETRY 字段还支持内存映射（mmap）存储，因此大型空间数据集无需完全放在 RAM 中。</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">使用 R-Tree 提高性能<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">查询延迟随数据增长保持不变。</h3><p>在没有 R-Tree 索引的情况下，查询时间与数据大小呈线性关系--数据量增加 10 倍，查询速度大约降低 10 倍。</p>
<p>有了 R-Tree 索引，查询时间则呈对数增长。在拥有数百万条记录的数据集上，空间过滤比全面扫描快几十到几百倍。</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">不为速度牺牲准确性</h3><p>R-Tree 通过边界框缩小候选对象的范围，然后 GEOS 用精确的几何数学检查每一个候选对象。任何看似匹配但实际上不在查询区域内的数据都会在第二次扫描中被删除。</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">提高混合搜索吞吐量</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>R-Tree 会首先删除目标区域外的记录。然后，Milvus 只对剩余的候选对象运行向量相似性（L2、IP 或余弦）。更少的候选记录意味着更低的搜索成本和更高的每秒查询次数（QPS）。</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">入门：使用 Python SDK 进行几何分析<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">定义 Collections 并创建索引</h3><p>首先，在 Collections Schema 中定义 DataType.GEOMETRY 字段。这样，Milvus 就能存储和查询几何数据。</p>
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
<h3 id="Insert-Data" class="common-anchor-header">插入数据</h3><p>插入数据时，几何值必须是 WKT（Well-Known 文本）格式。每条记录包括几何体、向量和其他字段。</p>
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
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">运行空间-向量混合查询（示例）</h3><p><strong>场景：</strong>查找在向量空间中最相似且位于给定点（如用户所在位置）2 公里范围内的前 3 个 POI。</p>
<p>使用 ST_DWITHIN 操作符应用距离筛选器。距离值以<strong>米</strong>为单位。</p>
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
<h2 id="Tips-for-Production-Use" class="common-anchor-header">生产使用提示<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>始终为 GEOMETRY 字段创建 R-Tree 索引。</strong>对于超过 10,000 个实体的数据集，没有 RTREE 索引的空间筛选器会退回到完全扫描，性能会急剧下降。</li>
<li><strong>使用一致的坐标系。</strong>所有位置数据必须使用相同的系统（如<a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>）。混合坐标系会破坏距离和包含计算。</li>
<li><strong>为查询选择正确的空间操作符。</strong>ST_DWITHIN 用于 "X 米以内 "的搜索。ST_CONTAINS 或 ST_WITHIN 用于地理围栏和包含检查。</li>
<li><strong>自动处理 NULL 几何值。</strong>如果 GEOMETRY 字段为空值（nullable=True），Milvus 会在空间查询时跳过 NULL 值。无需额外的过滤逻辑。</li>
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
    </button></h2><p>要在生产中使用这些功能，请确保您的环境满足以下要求。</p>
<p><strong>1.Milvus 版本</strong></p>
<p>您必须运行<strong>Milvus 2.6.4 或更高版本</strong>。早期版本不支持 DataType.GEOMETRY 或<strong>RTREE</strong>索引类型。</p>
<p><strong>2.SDK 版本</strong></p>
<ul>
<li><strong>PyMilvus</strong>：升级到最新版本（推荐使用<strong>2.6.x</strong>系列）。这是正确 WKT 序列化和传递 RTREE 索引参数所必需的。</li>
<li><strong>Java / Go / Node SDK</strong>：检查每个 SDK 的发布说明，确认它们与<strong>2.6.4</strong>proto 定义一致。</li>
</ul>
<p><strong>3.内置几何库</strong></p>
<p>Milvus 服务器已包含 Boost.Geometry 和 GEOS，因此无需自行安装这些库。</p>
<p><strong>4.内存使用和容量规划</strong></p>
<p>R-Tree 索引会占用额外内存。在规划容量时，请记住为几何索引以及 HNSW 或 IVF 等向量索引做好预算。几何字段支持内存映射（mmap）存储，可以通过在磁盘上保留部分数据来减少内存使用量。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>基于位置的语义搜索需要的不仅仅是在向量查询中加入地理过滤器。它需要内置的空间数据类型、适当的索引以及能同时处理位置和向量的查询引擎。</p>
<p><strong>Milvus 2.6.4</strong>通过本地<strong>GEOMETRY</strong>字段和<strong>R-Tree</strong>索引解决了这一问题。空间过滤和向量搜索在单个查询中针对单个数据存储运行。R-Tree 可处理快速的空间剪枝，而 GEOS 则可确保精确的结果。</p>
<p>对于需要位置感知检索的应用来说，这消除了运行和同步两个独立系统的复杂性。</p>
<p>如果您正在进行位置感知或混合空间和向量搜索，我们很乐意听听您的经验。</p>
<p><strong>对 Milvus 有疑问？</strong>加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>，或预约 20 分钟的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>会议。</p>
