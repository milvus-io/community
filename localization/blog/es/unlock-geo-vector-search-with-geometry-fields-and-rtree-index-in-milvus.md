---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >
  Bringing Geospatial Filtering and Vector Search Together with Geometry Fields
  and RTREE in Milvus 2.6
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_new_cover_1_a0439d3adf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Geospatial Filtering + Vector Search in Milvus with Geometry Fields and RTREE
desc: >-
  Learn how Milvus 2.6 unifies vector search with geospatial indexing using
  Geometry fields and the RTREE index, enabling accurate, location-aware AI
  retrieval.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>As AI systems are increasingly applied to real-time decision-making, geospatial data becomes increasingly important in a growing set of applications—particularly those that operate in the physical world or serve users across real locations.</p>
<p>Consider food delivery platforms like DoorDash or Uber Eats. When a user places an order, the system isn’t simply calculating the shortest distance between two points. It evaluates restaurant quality, courier availability, live traffic conditions, service areas, and increasingly, user and item embeddings that represent personal preferences. Similarly, autonomous vehicles must perform path planning, obstacle detection, and scene-level semantic understanding under strict latency constraints—often within milliseconds. In these domains, effective decisions depend on combining spatial constraints with semantic similarity, rather than treating them as independent steps.</p>
<p>At the data layer, however, spatial and semantic data have traditionally been handled by separate systems.</p>
<ul>
<li><p>Geospatial databases and spatial extensions are designed to store coordinates, polygons, and spatial relationships such as containment or distance.</p></li>
<li><p>Vector databases handle vector embeddings that represent the data’s semantic meaning.</p></li>
</ul>
<p>When applications need both, they are often forced into multi-stage query pipelines—filtering by location in one system, then performing vector search in another. This separation increases system complexity, adds query latency, and makes it difficult to perform spatial–semantic reasoning efficiently at scale.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> addresses this problem by introducing the <a href="https://milvus.io/docs/geometry-field.md">Geometry Field</a>, which allows vector similarity search to be combined directly with spatial constraints. This enables use cases such as:</p>
<ul>
<li><p>Location-Base Service (LBS): “find similar POIs within this city block”</p></li>
<li><p>Multi‑modal search: “retrieve similar photos within 1km of this point”</p></li>
<li><p>Maps &amp; logistics: “assets inside a region” or “routes intersecting a path”</p></li>
</ul>
<p>Paired with the new <a href="https://milvus.io/docs/rtree.md">RTREE index</a>—a tree-based structure optimized for spatial filtering—Milvus now supports efficient geospatial operators like <code translate="no">st_contains</code>, <code translate="no">st_within</code>, and <code translate="no">st_dwithin</code> alongside high-dimensional vector search. Together, they make spatially aware intelligent retrieval not just possible, but practical.</p>
<p>In this post, we’ll walk through how the Geometry Field and RTREE index work, and how they combine with vector similarity search to enable real-world, spatial-semantic applications.</p>
<h2 id="What-Is-a-Geometry-Field-in-Milvus" class="common-anchor-header">What Is a Geometry Field in Milvus?<button data-href="#What-Is-a-Geometry-Field-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>A <strong>Geometry field</strong> is a schema-defined data type (<code translate="no">DataType.GEOMETRY</code>) in Milvus used to store geometric data. Unlike systems that handle only raw coordinates, Milvus supports a range of spatial structures—including <strong>Point</strong>, <strong>LineString</strong>, and <strong>Polygon</strong>.</p>
<p>This makes it possible to represent real-world concepts such as restaurant locations (Point), delivery zones (Polygon), or autonomous-vehicle trajectories (LineString), all within the same database that stores semantic vectors. In other words, Milvus becomes a unified system for both <em>where</em> something is and <em>what it means</em>.</p>
<p>Geometry values are stored using the <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a> format, a human-readable standard for inserting and querying geometric data. This simplifies data ingestion and querying because WKT strings can be inserted directly into a Milvus record. For example:</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">What Is the RTREE Index and How Does It Work?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Once Milvus introduces the Geometry data type, it also needs an efficient way to filter spatial objects. Milvus handles this using a two-stage spatial filtering pipeline:</p>
<ul>
<li><p><strong>Coarse filtering:</strong> Quickly narrows down candidates using spatial indexes such as RTREE.</p></li>
<li><p><strong>Fine filtering:</strong> Applies exact geometry checks on the candidates that remain, ensuring correctness at boundaries.</p></li>
</ul>
<p>This design balances performance and accuracy. The spatial index aggressively prunes irrelevant data, while precise geometric checks ensure correct results for operators such as containment, intersection, and distance thresholds.</p>
<p>At the core of this pipeline is <strong>RTREE (Rectangle Tree)</strong>, a spatial indexing structure designed to accelerate queries over geometric data. RTREE works by organizing objects hierarchically using <strong>Minimum Bounding Rectangles (MBRs)</strong>, allowing large portions of the search space to be skipped during query execution.</p>
<h3 id="Phase-1-Building-the-RTREE-Index" class="common-anchor-header">Phase 1: Building the RTREE Index</h3><p>RTREE construction follows a bottom-up process that groups nearby spatial objects into increasingly larger bounding regions:</p>
<p><strong>1. Create leaf nodes:</strong> For each geometry object, calculate its <strong>Minimum Bounding Rectangle (MBR)</strong>—the smallest rectangle that fully contains the object—and store it as a leaf node.</p>
<p><strong>2. Group into larger boxs:</strong> Cluster nearby leaf nodes and wrap each group inside a new MBR, producing internal nodes.</p>
<p><strong>3. Add the root node:</strong> Create a root node whose MBR covers all internal groups, forming a height-balanced tree structure.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Phase 2: Accelerate queries</strong></p>
<p><strong>1. Form the query MBR:</strong> Calculate the MBR for the geometry used in your query.</p>
<p><strong>2. Prune branches:</strong> Starting from the root, compare the query MBR with each internal node. Skip any branch whose MBR does not intersect with the query MBR.</p>
<p><strong>3. Collect candidates:</strong> Descend into intersecting branches and gather the candidate leaf nodes.</p>
<p><strong>4. Perform exact matching:</strong> For each candidate, run the spatial predicate to get precise results.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">Why RTREE Is Fast</h3><p>RTREE delivers strong performance in spatial filtering because of several key design features:</p>
<ul>
<li><p><strong>Every node stores an MBR:</strong> Each node approximates the area of all geometries in its subtree. This makes it easy to decide whether a branch should be explored during a query.</p></li>
<li><p><strong>Fast pruning:</strong> Only subtrees whose MBR intersects the query region are explored. Irrelevant areas are ignored entirely.</p></li>
<li><p><strong>Scales with data size:</strong> RTREE supports spatial searches in <strong>O(log N)</strong> time, enabling fast queries even as the dataset expands.</p></li>
<li><p><strong>Boost.Geometry implementation:</strong> Milvus builds its RTREE index using <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a>, a widely used C++ library that provides optimized geometry algorithms and a thread-safe RTREE implementation suitable for concurrent workloads.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">Supported geometry operators</h3><p>Milvus provides a set of spatial operators that allow you to filter and retrieve entities based on geometric relationships. These operators are essential for workloads that need to understand how objects relate to one another in space.</p>
<p>The following table lists the <a href="https://milvus.io/docs/geometry-operators.md">geometry operators</a> currently available in Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Operator</strong></th><th style="text-align:center"><strong>Description</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">Returns TRUE if geometries A and B share at least one common point.</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">Returns TRUE if geometry A completely contains geometry B (excluding the boundary).</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">Returns TRUE if geometry A is completely contained within geometry B. This is the inverse of st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">Returns TRUE if geometry A covers geometry B (including the boundary).</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">Returns TRUE if geometries A and B touch at their boundaries but do not intersect internally.</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">Returns TRUE if geometries A and B are spatially identical.</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">Returns TRUE if geometries A and B partially overlap and neither fully contains the other.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">Returns TRUE if the distance between A and B is less than <em>d</em>.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">How to Combine Geolocation Index and Vector Index</h3><p>With Geometry support and the RTREE index, Milvus can combine geospatial filtering with vector similarity search in a single workflow. The process works in two steps:</p>
<p><strong>1. Filter by location using RTREE:</strong> Milvus first uses the RTREE index to narrow the search to entities within the specified geographic range (e.g., “within 2 km”).</p>
<p><strong>2. Rank by semantics using vector search:</strong> From the remaining candidates, the vector index selects the Top-N most similar results based on embedding similarity.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="common-anchor-header">Real-World Use Cases of Geo-Vector Retrieval<button data-href="#Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. Delivery Services: Smarter, Location-Aware Recommendations</h3><p>Platforms such as DoorDash or Uber Eats handle hundreds of millions of requests each day. The moment a user opens the app, the system must determine—based on the user’s location, time of day, taste preferences, estimated delivery times, real-time traffic, and courier availability—which restaurants or couriers are the best match <em>right now</em>.</p>
<p>Traditionally, this requires querying a geospatial database and a separate recommendation engine, followed by multiple rounds of filtering and re-ranking. With the Geolocation Index, Milvus greatly simplifies this workflow:</p>
<ul>
<li><p><strong>Unified storage</strong> — Restaurant coordinates, courier locations, and user preference embeddings all live in one system.</p></li>
<li><p><strong>Joint retrieval</strong> — First apply a spatial filter (e.g., <em>restaurants within 3 km</em>), then use vector search to rank by similarity, taste preference, or quality.</p></li>
<li><p><strong>Dynamic decision-making</strong> — Combine real-time courier distribution and traffic signals to quickly assign the nearest, most suitable courier.</p></li>
</ul>
<p>This unified approach allows the platform to perform spatial and semantic reasoning in a single query. For example, when a user searches “curry rice,” Milvus retrieves restaurants that are semantically relevant <em>and</em> prioritizes those that are nearby, deliver quickly, and match the user’s historical taste profile.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. Autonomous Driving: More Intelligent Decisions</h3><p>In autonomous driving, geospatial indexing is fundamental to perception, localization, and decision-making. Vehicles must continuously align themselves to high-definition maps, detect obstacles, and plan safe trajectories—all within just a few milliseconds.</p>
<p>With Milvus, the Geometry type and RTREE index can store and query rich spatial structures such as:</p>
<ul>
<li><p><strong>Road boundaries</strong> (LineString)</p></li>
<li><p><strong>Traffic regulation zones</strong> (Polygon)</p></li>
<li><p><strong>Detected obstacles</strong> (Point)</p></li>
</ul>
<p>These structures can be indexed efficiently, allowing geospatial data to take part directly in the AI decision loop. For example, an autonomous vehicle can quickly determine whether its current coordinates fall within a specific lane or intersect with a restricted area, simply through an RTREE spatial predicate.</p>
<p>When combined with vector embeddings generated by the perception system—such as scene embeddings that capture the current driving environment—Milvus can support more advanced queries, like retrieving historical driving scenarios similar to the current one within a 50-meter radius. This helps models interpret the environment faster and make better decisions.</p>
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
    </button></h2><p>Geolocation is more than latitude and longitude. In location-sensitive applications, it provides essential context about <strong>where events occur, how entities relate spatially, and how those relationships shape system behavior</strong>. When combined with semantic signals from machine learning models, geospatial data enables a richer class of queries that are difficult to express—or inefficient to execute—when spatial and vector data are handled separately.</p>
<p>With the introduction of the Geometry Field and the RTREE index, Milvus brings vector similarity search and spatial filtering into a single query engine. This allows applications to perform joint retrieval across <strong>vectors, geospatial data, and time</strong>, supporting use cases such as spatially aware recommendation systems, multimodal location-based search, and region- or path-constrained analytics. More importantly, it reduces architectural complexity by eliminating multi-stage pipelines that move data between specialized systems.</p>
<p>As AI systems continue to move closer to real-world decision-making, understanding <strong><em>what</em></strong> content is relevant will increasingly need to be paired with <strong><em>where</em></strong> it applies and <strong><em>when</em></strong> it matters. Milvus provides the building blocks for this class of spatial-semantic workloads in a way that is both expressive and practical for operating at scale.</p>
<p>For more information about the Geometry Field and the RTREE index, check the documentation below:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Geometry Field | Milvus Documentation</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Milvus Documentation</a></p></li>
</ul>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Learn More about Milvus 2.6 Features<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Introducing Milvus 2.6: Affordable Vector Search at Billion Scale</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization and Semantic Search</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM Capabilities in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie — Vector DBs Deserve a Real Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vector Search in the Real World: How to Filter Efficiently Without Killing Recall</a></p></li>
</ul>
