---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: |
  How to Use Hybrid Spatial and Vector Search with Milvus 
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
desc: >
  Learn how Milvus 2.6.4 enables hybrid spatial and vector search using Geometry
  and R-Tree, with performance insights and practical examples.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>A query like “find romantic restaurants within 3 km” sounds simple. It’s not, because it combines location filtering and semantic search. Most systems need to split this query across two databases, which means syncing data, merging results in code, and extra latency.</p>
<p><a href="https://milvus.io">Milvus</a> 2.6.4 eliminates this split. With a native <strong>GEOMETRY</strong> data type and an <strong>R-Tree</strong> index, Milvus can apply location and semantic constraints together in a single query. This makes hybrid spatial and semantic search much easier and more efficient.</p>
<p>This article explains why this change was needed, how GEOMETRY and R-Tree work inside Milvus, what performance gains to expect, and how to set it up with the Python SDK.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">The Limitations of Traditional Geo and Semantic Search<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Queries like “romantic restaurants within 3 km”  are hard to handle for two reasons:</p>
<ul>
<li><strong>“Romantic” needs semantic search.</strong> The system has to vectorize restaurant reviews and tags, then find matches by similarity in embedding space. This only works in a vector database.</li>
<li><strong>“Within 3 km” needs spatial filtering.</strong> Results must be restricted to “within 3 km of the user,” or sometimes “inside a specific delivery polygon or administrative boundary.”</li>
</ul>
<p>In a traditional architecture, meeting both needs usually meant running two systems side by side:</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> for geofencing, distance calculations, and spatial filtering.</li>
<li>A <strong>vector database</strong> for approximate nearest neighbor (ANN) search over embeddings.</li>
</ul>
<p>This “two-database” design creates three practical problems:</p>
<ul>
<li><strong>Painful data synchronization.</strong> If a restaurant changes its address, you must update both the geo system and the vector database. Missing one update produces inconsistent results.</li>
<li><strong>Higher latency.</strong> The application has to call two systems and merge their outputs, adding network round-trips and processing time.</li>
<li><strong>Inefficient filtering.</strong> If the system ran vector search first, it often returned many results that were far from the user and had to be discarded later. If it applied location filtering first, the remaining set was still large, so the vector search step was still expensive.</li>
</ul>
<p>Milvus 2.6.4 solves this by adding spatial geometry support directly to the vector database. Semantic search and location filtering now run in the same query. With everything in one system, hybrid search is faster and easier to manage.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">What GEOMETRY Adds to Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduces a scalar field type called DataType.GEOMETRY. Instead of storing locations as separate longitude and latitude numbers, Milvus now stores geometric objects: points, lines, and polygons. Queries like “is this point inside a region?” or “is it within X meters?” become native operations. There’s no need to build workarounds over raw coordinates.</p>
<p>The implementation follows the <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access standard</strong>, so it works with most existing geospatial tooling. Geometry data is stored and queried using <strong>WKT (Well-Known Text)</strong>, a standard text format that is readable by humans and parseable by programs.</p>
<p>Supported geometry types:</p>
<ul>
<li><strong>POINT</strong>: a single location, such as a store address or a vehicle’s real-time position</li>
<li><strong>LINESTRING</strong>: a line, such as a road centerline or a movement path</li>
<li><strong>POLYGON</strong>: an area, such as an administrative boundary or a geofence</li>
<li><strong>Collection types</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, and GEOMETRYCOLLECTION</li>
</ul>
<p>It also supports standard spatial operators, including:</p>
<ul>
<li><strong>Spatial relationships</strong>: containment (ST_CONTAINS, ST_WITHIN), intersection (ST_INTERSECTS, ST_CROSSES), and contact (ST_TOUCHES)</li>
<li><strong>Distance operations</strong>: computing distances between geometries (ST_DISTANCE) and filtering objects within a given distance (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">How R-Tree Indexing Works Inside Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>GEOMETRY support is built into the Milvus query engine, not just exposed as an API feature. ISpatial data is indexed and processed directly inside the engine using the R-Tree (Rectangle Tree) index.</p>
<p>An <strong>R-Tree</strong> groups nearby objects using <strong>minimum bounding rectangles (MBRs)</strong>. During a query, the engine skips large regions that do not overlap with the query geometry and only runs detailed checks on a small set of candidates. This is much faster than scanning every object.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">How Milvus Builds the R-Tree</h3><p>R-Tree construction happens in layers:</p>
<table>
<thead>
<tr><th><strong>Level</strong></th><th><strong>What Milvus Does</strong></th><th><strong>Intuitive Analogy</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Leaf level</strong></td><td>For each geometry object (point, line, or polygon), Milvus computes its minimum bounding rectangle (MBR) and stores it as a leaf node.</td><td>Wrapping each item in a transparent box that fits it exactly.</td></tr>
<tr><td><strong>Intermediate levels</strong></td><td>Nearby leaf nodes are grouped together (typically 50–100 at a time), and a larger parent MBR is created to cover all of them.</td><td>Putting packages from the same neighborhood into a single delivery crate.</td></tr>
<tr><td><strong>Root level</strong></td><td>This grouping continues upward until all data is covered by a single root MBR.</td><td>Loading all crates onto one long-haul truck.</td></tr>
</tbody>
</table>
<p>With this structure in place, spatial query complexity drops from a full scan <strong>O(n)</strong> to <strong>O(log n)</strong>. In practice, queries over millions of records can go from hundreds of milliseconds down to just a few milliseconds, without losing accuracy.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">How Queries are Executed: Two-Phase Filtering</h3><p>To balance speed and correctness, Milvus uses a <strong>two-phase filtering</strong> strategy:</p>
<ul>
<li><strong>Rough filter:</strong> the R-Tree index first checks whether the query’s bounding rectangle overlaps with other bounding rectangles in the index. This quickly removes most unrelated data and keeps only a small set of candidates. Because these rectangles are simple shapes, the check is very fast, but it can include some results that don’t actually match.</li>
<li><strong>Fine filter</strong>: the remaining candidates are then checked using <strong>GEOS</strong>, the same geometry library used by systems like PostGIS. GEOS runs exact geometry calculations, such as whether shapes intersect or one contains another, to produce correct final results.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus accepts geometry data in <strong>WKT (Well-Known Text)</strong> format but stores it internally as <strong>WKB (Well-Known Binary).</strong> WKB is more compact, which cuts storage and improves I/O. GEOMETRY fields also support memory-mapped (mmap) storage, so large spatial datasets don’t need to fit entirely in RAM.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Performance Improvements with R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">Query Latency Stays Flat as Data Grows.</h3><p>Without an R-Tree index, query time scales linearly with data size — 10x more data means roughly 10x slower queries.</p>
<p>With R-Tree, query time grows logarithmically. On datasets with millions of records, spatial filtering can be tens to hundreds of times faster than a full scan.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">Accuracy is Not Sacrificed For Speed</h3><p>The R-Tree narrows candidates by bounding box, then GEOS checks each one with exact geometry math. Anything that looks like a match but actually falls outside the query area gets removed in the second pass.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">Hybrid Search Throughput Improves</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The R-Tree removes records outside the target area first. Milvus then runs vector similarity (L2, IP, or cosine) only on the remaining candidates. Fewer candidates means lower search cost and higher queries per second (QPS).</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Getting Started: GEOMETRY with the Python SDK<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Define the Collection and Create Indexes</h3><p>First, define a DataType.GEOMETRY field in the collection schema. This allows Milvus to store and query geometric data.</p>
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
<h3 id="Insert-Data" class="common-anchor-header">Insert Data</h3><p>When inserting data, geometry values must be in WKT (Well-Known Text) format. Each record includes the geometry, the vector, and other fields.</p>
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
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Run a Hybrid Spatial-Vector Query (Example)</h3><p><strong>Scenario:</strong> find the top 3 POIs that are most similar in vector space and located within 2 kilometers of a given point, such as the user’s location.</p>
<p>Use the ST_DWITHIN operator to apply the distance filter. The distance value is specified in <strong>meters.</strong></p>
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
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Tips for Production Use<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Always create an R-Tree index on GEOMETRY fields.</strong> For datasets above 10,000 entities, spatial filters without an RTREE index fall back to a full scan, and performance drops sharply.</li>
<li><strong>Use a consistent coordinate system.</strong> All location data must use the same system (e.g., <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a><a href="https://en.wikipedia.org/wiki/World_Geodetic_System">WGS 84</a>). Mixing coordinate systems breaks distance and containment calculations.</li>
<li><strong>Pick the right spatial operator for the query.</strong> ST_DWITHIN for “within X meters” searches. ST_CONTAINS or ST_WITHIN for geofencing and containment checks.</li>
<li><strong>NULL geometry values are handled automatically.</strong> If the GEOMETRY field is nullable (nullable=True), Milvus skips NULL values during spatial queries. No extra filtering logic needed.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Deployment Requirements<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>To use these features in production, make sure your environment meets the following requirements.</p>
<p><strong>1. Milvus Version</strong></p>
<p>You must run <strong>Milvus 2.6.4 or later</strong>. Earlier versions do not support DataType.GEOMETRY or the <strong>RTREE</strong> index type.</p>
<p><strong>2. SDK Versions</strong></p>
<ul>
<li><strong>PyMilvus</strong>: upgrade to the latest version (the <strong>2.6.x</strong> series is recommended). This is required for proper WKT serialization and for passing RTREE index parameters.</li>
<li><strong>Java / Go / Node SDKs</strong>: check the release notes for each SDK and confirm that they are aligned with the <strong>2.6.4</strong> proto definitions.</li>
</ul>
<p><strong>3. Built-in Geometry Libraries</strong></p>
<p>The Milvus server already includes Boost.Geometry and GEOS, so you don’t need to install these libraries yourself.</p>
<p><strong>4. Memory Usage and Capacity Planning</strong></p>
<p>R-Tree indexes use extra memory. When planning capacity, remember to budget for geometry indexes as well as vector indexes like HNSW or IVF. The GEOMETRY field supports memory-mapped (mmap) storage, which can reduce memory usage by keeping part of the data on disk.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Location-based semantic search needs more than bolting a geo filter onto a vector query. It requires built-in spatial data types, proper indexes, and a query engine that can handle location and vectors together.</p>
<p><strong>Milvus 2.6.4</strong> solves this with native <strong>GEOMETRY</strong> fields and <strong>R-Tree</strong> indexes. Spatial filtering and vector search run in a single query, against a single data store. The R-Tree handles fast spatial pruning while GEOS ensures exact results.</p>
<p>For applications that need location-aware retrieval, this removes the complexity of running and syncing two separate systems.</p>
<p>If you’re working on location-aware or hybrid spatial and vector search, we’d love to hear your experience.</p>
<p><strong>Have questions about Milvus?</strong> Join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack channel</a> or book a 20-minute <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> session.</p>
