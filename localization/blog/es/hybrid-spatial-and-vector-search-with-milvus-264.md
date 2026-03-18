---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Cómo utilizar la búsqueda espacial y vectorial híbrida con Milvus
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
desc: >-
  Descubra cómo Milvus 2.6.4 permite la búsqueda híbrida espacial y vectorial
  mediante Geometry y R-Tree, con información sobre el rendimiento y ejemplos
  prácticos.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>Una consulta como "encontrar restaurantes románticos en un radio de 3 km" parece sencilla. No lo es, porque combina el filtrado por ubicación y la búsqueda semántica. La mayoría de los sistemas tienen que dividir esta consulta en dos bases de datos, lo que implica sincronizar los datos, fusionar los resultados en el código y una latencia adicional.</p>
<p><a href="https://milvus.io">Milvus</a> 2.6.4 elimina esta división. Con un tipo de datos nativo <strong>GEOMETRY</strong> y un índice <strong>R-Tree</strong>, Milvus puede aplicar restricciones de ubicación y semánticas juntas en una sola consulta. Esto hace que la búsqueda híbrida espacial y semántica sea mucho más fácil y eficiente.</p>
<p>Este artículo explica por qué era necesario este cambio, cómo funcionan GEOMETRY y R-Tree dentro de Milvus, qué mejoras de rendimiento cabe esperar y cómo configurarlo con el SDK de Python.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">Las limitaciones de la búsqueda semántica y geográfica tradicional<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Consultas como "restaurantes románticos a menos de 3 km" son difíciles de manejar por dos razones:</p>
<ul>
<li><strong>"Romántico" requiere una búsqueda semántica.</strong> El sistema tiene que vectorizar las reseñas y etiquetas de los restaurantes y, a continuación, buscar coincidencias por similitud en el espacio de incrustación. Esto sólo funciona en una base de datos vectorial.</li>
<li><strong>"En un radio de 3 km" requiere un filtrado espacial.</strong> Los resultados deben restringirse a "en un radio de 3 km del usuario" o, a veces, "dentro de un polígono de entrega o límite administrativo específico".</li>
</ul>
<p>En una arquitectura tradicional, satisfacer ambas necesidades generalmente significaba ejecutar dos sistemas uno al lado del otro:</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> para geofencing, cálculos de distancia y filtrado espacial.</li>
<li>Una <strong>base de datos vectorial</strong> para la búsqueda aproximada del vecino más cercano (RNA) sobre incrustaciones.</li>
</ul>
<p>Este diseño de "dos bases de datos" crea tres problemas prácticos:</p>
<ul>
<li><strong>La penosa sincronización de datos.</strong> Si un restaurante cambia de dirección, hay que actualizar tanto el sistema geográfico como la base de datos vectorial. Si se omite una actualización, los resultados son incoherentes.</li>
<li><strong>Mayor latencia.</strong> La aplicación tiene que llamar a dos sistemas y combinar sus resultados, lo que añade viajes de ida y vuelta por la red y tiempo de procesamiento.</li>
<li><strong>Filtrado ineficaz.</strong> Si el sistema ejecutaba primero la búsqueda vectorial, a menudo devolvía muchos resultados que estaban lejos del usuario y había que descartar después. Si se aplicaba primero el filtrado por localización, el conjunto restante seguía siendo grande, por lo que el paso de búsqueda vectorial seguía siendo costoso.</li>
</ul>
<p>Milvus 2.6.4 resuelve esto añadiendo soporte de geometría espacial directamente a la base de datos vectorial. La búsqueda semántica y el filtrado por localización se ejecutan ahora en la misma consulta. Con todo en un solo sistema, la búsqueda híbrida es más rápida y fácil de gestionar.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">Qué añade GEOMETRY a Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduce un tipo de campo escalar llamado DataType.GEOMETRY. En lugar de almacenar ubicaciones como números separados de longitud y latitud, Milvus almacena ahora objetos geométricos: puntos, líneas y polígonos. Consultas como "¿está este punto dentro de una región?" o "¿está dentro de X metros?" se convierten en operaciones nativas. No hay necesidad de construir soluciones sobre coordenadas en bruto.</p>
<p>La implementación sigue el<strong>estándar</strong> <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access</strong>, por lo que funciona con la mayoría de las herramientas geoespaciales existentes. Los datos geométricos se almacenan y consultan utilizando <strong>WKT (Well-Known Text)</strong>, un formato de texto estándar legible por humanos y analizable por programas.</p>
<p>Tipos de geometría admitidos</p>
<ul>
<li><strong>PUNTO</strong>: una única ubicación, como la dirección de una tienda o la posición en tiempo real de un vehículo.</li>
<li><strong>LÍNEA</strong>: una línea, como la línea central de una carretera o una trayectoria de movimiento.</li>
<li><strong>POLÍGONO</strong>: un área, como un límite administrativo o una geovalla</li>
<li><strong>Tipos de recogida</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON y GEOMETRYCOLLECTION</li>
</ul>
<p>También admite operadores espaciales estándar, entre los que se incluyen:</p>
<ul>
<li><strong>Relaciones espaciales</strong>: contención (ST_CONTAINS, ST_WITHIN), intersección (ST_INTERSECTS, ST_CROSSES) y contacto (ST_TOUCHES).</li>
<li><strong>Operaciones de distancia</strong>: cálculo de distancias entre geometrías (ST_DISTANCE) y filtrado de objetos dentro de una distancia determinada (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Cómo funciona la indexación R-Tree en Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>El soporte de GEOMETRÍA está integrado en el motor de consulta de Milvus, no sólo expuesto como una función de la API. Los datos ISpatial se indexan y procesan directamente dentro del motor utilizando el índice R-Tree (Rectangle Tree).</p>
<p>Un <strong>R-Tree</strong> agrupa los objetos cercanos mediante <strong>rectángulos de delimitación mínima (MBR)</strong>. Durante una consulta, el motor omite las grandes regiones que no se solapan con la geometría de la consulta y sólo ejecuta comprobaciones detalladas en un pequeño conjunto de candidatos. Esto es mucho más rápido que escanear cada objeto.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Cómo construye Milvus el árbol R</h3><p>El R-Tree se construye por capas:</p>
<table>
<thead>
<tr><th><strong>Nivel</strong></th><th><strong>Qué hace Milvus</strong></th><th><strong>Analogía intuitiva</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Nivel de hoja</strong></td><td>Para cada objeto geométrico (punto, línea o polígono), Milvus calcula su rectángulo mínimo delimitador (RMB) y lo almacena como nodo hoja.</td><td>Envuelve cada objeto en una caja transparente que se ajusta exactamente a él.</td></tr>
<tr><td><strong>Niveles intermedios</strong></td><td>Los nodos hoja cercanos se agrupan (normalmente 50-100 a la vez), y se crea un MBR padre más grande para cubrirlos a todos.</td><td>Colocación de paquetes del mismo vecindario en una única caja de entrega.</td></tr>
<tr><td><strong>Nivel raíz</strong></td><td>Esta agrupación continúa hacia arriba hasta que todos los datos están cubiertos por un único MBR raíz.</td><td>Carga de todas las cajas en un camión de larga distancia.</td></tr>
</tbody>
</table>
<p>Con esta estructura, la complejidad de las consultas espaciales se reduce de <strong>O(n)</strong> a <strong>O(log n)</strong>. En la práctica, las consultas sobre millones de registros pueden pasar de cientos de milisegundos a unos pocos milisegundos, sin perder precisión.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">Cómo se ejecutan las consultas: Filtrado en dos fases</h3><p>Para equilibrar velocidad y corrección, Milvus utiliza una estrategia de <strong>filtrado en dos</strong> fases:</p>
<ul>
<li><strong>Filtro aproximado:</strong> el índice R-Tree comprueba primero si el rectángulo delimitador de la consulta se solapa con otros rectángulos delimitadores del índice. Esto elimina rápidamente la mayoría de los datos no relacionados y mantiene sólo un pequeño conjunto de candidatos. Como estos rectángulos tienen formas simples, la comprobación es muy rápida, pero puede incluir algunos resultados que en realidad no coinciden.</li>
<li><strong>Filtro fino</strong>: los candidatos restantes se comprueban con <strong>GEOS</strong>, la misma biblioteca de geometría que utilizan sistemas como PostGIS. GEOS ejecuta cálculos geométricos exactos, como si las formas se cruzan o si una contiene a otra, para producir resultados finales correctos.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus acepta datos geométricos en formato <strong>WKT (</strong> <strong>Well-Known</strong> <strong>Text)</strong> pero los almacena internamente como <strong>WKB (Well-Known Binary).</strong> WKB es más compacto, lo que reduce el almacenamiento y mejora la E/S. Los campos GEOMETRY también admiten almacenamiento en mapa de memoria (mmap), por lo que los grandes conjuntos de datos espaciales no necesitan caber por completo en la RAM.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Mejoras de rendimiento con R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">La latencia de las consultas se mantiene estable a medida que crecen los datos.</h3><p>Sin un índice R-Tree, el tiempo de consulta aumenta linealmente con el tamaño de los datos: 10 veces más datos significa aproximadamente 10 veces más lentitud en las consultas.</p>
<p>Con R-Tree, el tiempo de consulta crece logarítmicamente. En conjuntos de datos con millones de registros, el filtrado espacial puede ser de decenas a cientos de veces más rápido que una exploración completa.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">La velocidad no sacrifica la precisión</h3><p>El R-Tree reduce los candidatos por cuadro delimitador y, a continuación, GEOS comprueba cada uno de ellos con matemáticas de geometría exacta. Todo lo que parece coincidir pero queda fuera del área de búsqueda se elimina en la segunda pasada.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">El rendimiento de la búsqueda híbrida mejora</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El árbol R elimina primero los registros que quedan fuera de la zona objetivo. A continuación, Milvus ejecuta la similitud vectorial (L2, IP o coseno) sólo en los candidatos restantes. Menos candidatos significa menor coste de búsqueda y mayor número de consultas por segundo (QPS).</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Primeros pasos: GEOMETRÍA con el SDK de Python<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Definir la colección y crear índices</h3><p>Primero, defina un campo DataType.GEOMETRY en el esquema de la colección. Esto permite a Milvus almacenar y consultar datos geométricos.</p>
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
<h3 id="Insert-Data" class="common-anchor-header">Insertar datos</h3><p>Al insertar datos, los valores geométricos deben estar en formato WKT (Well-Known Text). Cada registro incluye la geometría, el vector y otros campos.</p>
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
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Ejecutar una consulta híbrida espacial-vectorial (ejemplo)</h3><p><strong>Escenario:</strong> encontrar los 3 PDI más similares en el espacio vectorial y situados a menos de 2 kilómetros de un punto dado, como la ubicación del usuario.</p>
<p>Utilice el operador ST_DWITHIN para aplicar el filtro de distancia. El valor de la distancia se especifica en <strong>metros.</strong></p>
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
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Consejos para el uso en producción<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Cree siempre un índice R-Tree en los campos GEOMETRÍA.</strong> Para conjuntos de datos superiores a 10.000 entidades, los filtros espaciales sin un índice RTREE retroceden a un escaneo completo, y el rendimiento cae bruscamente.</li>
<li><strong>Utilice un sistema de coordenadas coherente.</strong> Todos los datos de localización deben utilizar el mismo sistema (por ejemplo, <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). Mezclar sistemas de coordenadas rompe los cálculos de distancia y contención.</li>
<li><strong>Elija el operador espacial adecuado para la consulta.</strong> ST_DWITHIN para búsquedas "dentro de X metros". ST_CONTAINS o ST_WITHIN para geofencing y comprobaciones de contención.</li>
<li><strong>Los valores de geometría nulos se gestionan automáticamente.</strong> Si el campo GEOMETRY es anulable (nullable=True), Milvus omite los valores NULL durante las consultas espaciales. No se necesita lógica de filtrado adicional.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Requisitos de despliegue<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Para utilizar estas características en producción, asegúrese de que su entorno cumple los siguientes requisitos.</p>
<p><strong>1. Versión de Milvus</strong></p>
<p>Debe ejecutar <strong>Milvus 2.6.4 o posterior</strong>. Las versiones anteriores no admiten DataType.GEOMETRY ni el tipo de índice <strong>RTREE</strong>.</p>
<p><strong>2. Versiones SDK</strong></p>
<ul>
<li><strong>PyMilvus</strong>: actualice a la última versión (se recomienda la serie <strong>2.6.x</strong> ). Esto es necesario para la correcta serialización WKT y para pasar parámetros de índice RTREE.</li>
<li><strong>Java / Go / Node SDKs</strong>: compruebe las notas de la versión para cada SDK y confirme que están alineados con las definiciones de proto <strong>2.6.4</strong>.</li>
</ul>
<p><strong>3. Bibliotecas de geometría incorporadas</strong></p>
<p>El servidor Milvus ya incluye Boost.Geometry y GEOS, por lo que no necesita instalar estas bibliotecas usted mismo.</p>
<p><strong>4. Uso de memoria y planificación de capacidad</strong></p>
<p>Los índices R-Tree utilizan memoria extra. Cuando planifique la capacidad, recuerde presupuestar los índices geométricos así como los índices vectoriales como HNSW o IVF. El campo GEOMETRY admite el almacenamiento en mapa de memoria (mmap), que puede reducir el uso de memoria manteniendo parte de los datos en disco.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda semántica basada en la localización requiere algo más que añadir un filtro geográfico a una consulta vectorial. Requiere tipos de datos espaciales incorporados, índices adecuados y un motor de consulta que pueda manejar la ubicación y los vectores conjuntamente.</p>
<p><strong>Milvus 2.6.4</strong> resuelve esto con campos <strong>GEOMETRY</strong> nativos e índices <strong>R-Tree</strong>. El filtrado espacial y la búsqueda vectorial se ejecutan en una única consulta, contra un único almacén de datos. El R-Tree se encarga de la poda espacial rápida, mientras que GEOS garantiza resultados exactos.</p>
<p>Para las aplicaciones que necesitan una recuperación que tenga en cuenta la ubicación, esto elimina la complejidad de ejecutar y sincronizar dos sistemas distintos.</p>
<p>Si está trabajando en una búsqueda espacial y vectorial consciente de la ubicación o híbrida, nos encantaría conocer su experiencia.</p>
<p><strong>¿Tiene preguntas sobre Milvus?</strong> Únase a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> o reserve una sesión de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a>.</p>
