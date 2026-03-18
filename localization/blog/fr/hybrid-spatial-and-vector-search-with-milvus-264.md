---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Comment utiliser la recherche spatiale et vectorielle hybride avec Milvus ?
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
  Découvrez comment Milvus 2.6.4 permet une recherche spatiale et vectorielle
  hybride à l'aide de Geometry et de R-Tree, avec des aperçus des performances
  et des exemples pratiques.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>Une requête telle que "trouver des restaurants romantiques à moins de 3 km" semble simple. Elle ne l'est pas, car elle combine le filtrage de l'emplacement et la recherche sémantique. La plupart des systèmes doivent répartir cette requête sur deux bases de données, ce qui implique la synchronisation des données, la fusion des résultats dans le code et une latence supplémentaire.</p>
<p><a href="https://milvus.io">Milvus</a> 2.6.4 élimine cette division. Avec un type de données <strong>GEOMETRY</strong> natif et un index <strong>R-Tree</strong>, Milvus peut appliquer des contraintes de localisation et sémantiques dans une seule requête. Cela rend la recherche spatiale et sémantique hybride beaucoup plus facile et plus efficace.</p>
<p>Cet article explique pourquoi ce changement était nécessaire, comment GEOMETRY et R-Tree fonctionnent dans Milvus, quels sont les gains de performance à attendre et comment le configurer avec le SDK Python.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">Les limites de la recherche géospatiale et sémantique traditionnelle<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Des requêtes telles que "restaurants romantiques à moins de 3 km" sont difficiles à traiter pour deux raisons :</p>
<ul>
<li><strong>Le terme "romantique" nécessite une recherche sémantique.</strong> Le système doit vectoriser les critiques et les étiquettes des restaurants, puis trouver des correspondances par similarité dans l'espace d'intégration. Cela ne fonctionne que dans une base de données vectorielle.</li>
<li><strong>"Dans un rayon de 3 km" nécessite un filtrage spatial.</strong> Les résultats doivent être limités à "moins de 3 km de l'utilisateur", ou parfois "à l'intérieur d'un polygone de livraison spécifique ou d'une limite administrative".</li>
</ul>
<p>Dans une architecture traditionnelle, répondre à ces deux besoins signifiait généralement faire fonctionner deux systèmes côte à côte :</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> pour le geofencing, les calculs de distance et le filtrage spatial.</li>
<li>Une <strong>base de données vectorielle</strong> pour la recherche approximative du plus proche voisin (ANN) sur les embeddings.</li>
</ul>
<p>Cette conception "à deux bases de données" crée trois problèmes pratiques :</p>
<ul>
<li><strong>Synchronisation fastidieuse des données.</strong> Si un restaurant change d'adresse, vous devez mettre à jour à la fois le système géographique et la base de données vectorielle. L'absence d'une mise à jour entraîne des résultats incohérents.</li>
<li><strong>Temps de latence plus élevé.</strong> L'application doit appeler deux systèmes et fusionner leurs résultats, ce qui augmente les allers-retours sur le réseau et le temps de traitement.</li>
<li><strong>Filtrage inefficace.</strong> Si le système effectue d'abord une recherche vectorielle, il renvoie souvent de nombreux résultats éloignés de l'utilisateur, qui doivent être éliminés par la suite. S'il appliquait d'abord le filtrage par localisation, l'ensemble restant était encore important, de sorte que l'étape de recherche vectorielle était encore coûteuse.</li>
</ul>
<p>Milvus 2.6.4 résout ce problème en ajoutant la prise en charge de la géométrie spatiale directement à la base de données vectorielle. La recherche sémantique et le filtrage de l'emplacement sont désormais exécutés dans la même requête. Avec tout cela dans un seul système, la recherche hybride est plus rapide et plus facile à gérer.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">Ce que GEOMETRY ajoute à Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduit un type de champ scalaire appelé DataType.GEOMETRY. Au lieu de stocker les emplacements sous forme de numéros de longitude et de latitude distincts, Milvus stocke désormais des objets géométriques : points, lignes et polygones. Des requêtes telles que "ce point est-il situé à l'intérieur d'une région ?" ou "est-il situé à moins de X mètres ?" deviennent des opérations natives. Il n'est pas nécessaire de construire des solutions de contournement pour les coordonnées brutes.</p>
<p>L'implémentation suit le<strong>standard OpenGIS Simple Features Access (</strong> <a href="https://www.ogc.org/standard/sfa/"></a><strong></strong>), et fonctionne donc avec la plupart des outils géospatiaux existants. Les données géométriques sont stockées et interrogées à l'aide de <strong>WKT (Well-Known Text)</strong>, un format de texte standard lisible par l'homme et analysable par les programmes.</p>
<p>Types de géométrie pris en charge</p>
<ul>
<li><strong>POINT</strong>: un emplacement unique, tel que l'adresse d'un magasin ou la position en temps réel d'un véhicule.</li>
<li><strong>LINESTRING</strong>: une ligne, telle que l'axe d'une route ou une trajectoire de déplacement.</li>
<li><strong>POLYGONE</strong>: une zone, telle qu'une limite administrative ou une géofence.</li>
<li><strong>Types de collecte</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON et GEOMETRYCOLLECTION.</li>
</ul>
<p>Il prend également en charge les opérateurs spatiaux standard, notamment</p>
<ul>
<li><strong>Relations spatiales</strong>: confinement (ST_CONTAINS, ST_WITHIN), intersection (ST_INTERSECTS, ST_CROSSES) et contact (ST_TOUCHES).</li>
<li><strong>Opérations de distance</strong>: calcul des distances entre les géométries (ST_DISTANCE) et filtrage des objets situés à une distance donnée (ST_DWITHIN).</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Fonctionnement de l'indexation R-Tree dans Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>La prise en charge de la GÉOMÉTRIE est intégrée au moteur de requête Milvus et n'est pas seulement exposée en tant que fonctionnalité API. Les données spatiales sont indexées et traitées directement dans le moteur à l'aide de l'index R-Tree (Rectangle Tree).</p>
<p>Un <strong>arbre R</strong> regroupe les objets proches à l'aide de <strong>rectangles de délimitation minimaux (MBR)</strong>. Lors d'une requête, le moteur ignore les grandes régions qui ne se chevauchent pas avec la géométrie de la requête et n'effectue des vérifications détaillées que sur un petit ensemble de candidats. Cette méthode est beaucoup plus rapide que l'analyse de chaque objet.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Comment Milvus construit l'arbre R</h3><p>La construction d'un R-Tree se fait par couches :</p>
<table>
<thead>
<tr><th><strong>Niveau</strong></th><th><strong>Ce que fait Milvus</strong></th><th><strong>Analogie intuitive</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Niveau des feuilles</strong></td><td>Pour chaque objet géométrique (point, ligne ou polygone), Milvus calcule son rectangle minimal de délimitation (RMB) et le stocke en tant que nœud feuille.</td><td>Envelopper chaque élément dans une boîte transparente qui lui correspond exactement.</td></tr>
<tr><td><strong>Niveaux intermédiaires</strong></td><td>Les nœuds feuilles proches sont regroupés (généralement 50 à 100 à la fois) et un MBR parent plus grand est créé pour les couvrir tous.</td><td>Regroupement des colis provenant d'un même quartier dans une seule caisse de livraison.</td></tr>
<tr><td><strong>Niveau racine</strong></td><td>Ce regroupement se poursuit jusqu'à ce que toutes les données soient couvertes par un seul MBR racine.</td><td>Chargement de toutes les caisses dans un seul camion longue distance.</td></tr>
</tbody>
</table>
<p>Grâce à cette structure, la complexité des requêtes spatiales passe d'un balayage complet <strong>O(n)</strong> à <strong>O(log n)</strong>. En pratique, les requêtes portant sur des millions d'enregistrements peuvent passer de centaines de millisecondes à quelques millisecondes seulement, sans perdre en précision.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">Comment les requêtes sont-elles exécutées ? Filtrage en deux phases</h3><p>Pour concilier vitesse et exactitude, Milvus utilise une stratégie de <strong>filtrage en deux phases</strong>:</p>
<ul>
<li><strong>Filtre grossier :</strong> l'index R-Tree vérifie d'abord si le rectangle englobant de la requête se superpose à d'autres rectangles englobants dans l'index. Cela permet d'éliminer rapidement la plupart des données non liées et de ne conserver qu'un petit ensemble de candidats. Comme ces rectangles sont des formes simples, la vérification est très rapide, mais elle peut inclure des résultats qui ne correspondent pas réellement.</li>
<li><strong>Filtre fin</strong>: les candidats restants sont ensuite vérifiés à l'aide de <strong>GEOS</strong>, la même bibliothèque géométrique que celle utilisée par des systèmes tels que PostGIS. GEOS effectue des calculs géométriques exacts, par exemple pour déterminer si les formes se croisent ou si l'une contient l'autre, afin de produire des résultats finaux corrects.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus accepte les données géométriques au format <strong>WKT (Well-Known Text)</strong> mais les stocke en interne au format <strong>WKB (Well-Known Binary).</strong> Le format WKB est plus compact, ce qui permet de réduire le stockage et d'améliorer les E/S. Les champs GEOMETRY prennent également en charge le stockage en mémoire mappée (mmap), de sorte que les grands ensembles de données spatiales n'ont pas besoin d'être entièrement stockés dans la RAM.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Amélioration des performances avec R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">La latence des requêtes reste stable au fur et à mesure que les données augmentent.</h3><p>Sans index R-Tree, le temps de requête augmente linéairement avec la taille des données - 10 fois plus de données signifient des requêtes environ 10 fois plus lentes.</p>
<p>Avec un index R-Tree, le temps d'interrogation augmente de façon logarithmique. Sur des ensembles de données comportant des millions d'enregistrements, le filtrage spatial peut être des dizaines, voire des centaines de fois plus rapide qu'un balayage complet.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">La précision n'est pas sacrifiée à la vitesse</h3><p>L'arbre R réduit les candidats par boîte englobante, puis GEOS vérifie chacun d'entre eux à l'aide de mathématiques géométriques exactes. Tout ce qui ressemble à une correspondance mais qui se trouve en fait en dehors de la zone de recherche est supprimé lors de la deuxième passe.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">Amélioration du débit de la recherche hybride</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'arbre R supprime d'abord les enregistrements situés en dehors de la zone cible. Milvus exécute ensuite la similarité vectorielle (L2, IP ou cosinus) uniquement sur les candidats restants. Moins de candidats signifie un coût de recherche plus faible et des requêtes par seconde (QPS) plus élevées.</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Pour commencer : La géométrie avec le SDK Python<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Définition de la collection et création d'index</h3><p>Commencez par définir un champ DataType.GEOMETRY dans le schéma de la collection. Cela permet à Milvus de stocker et d'interroger des données géométriques.</p>
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
<h3 id="Insert-Data" class="common-anchor-header">Insérer des données</h3><p>Lors de l'insertion de données, les valeurs géométriques doivent être au format WKT (Well-Known Text). Chaque enregistrement comprend la géométrie, le vecteur et d'autres champs.</p>
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
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Exécution d'une requête hybride spatio-vectorielle (exemple)</h3><p><strong>Scénario :</strong> trouver les 3 POI les plus similaires dans l'espace vectoriel et situés à moins de 2 kilomètres d'un point donné, tel que l'emplacement de l'utilisateur.</p>
<p>Utilisez l'opérateur ST_DWITHIN pour appliquer le filtre de distance. La valeur de la distance est spécifiée en <strong>mètres.</strong></p>
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
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Conseils pour l'utilisation en production<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Créez toujours un index R-Tree sur les champs GEOMETRY.</strong> Pour les ensembles de données de plus de 10 000 entités, les filtres spatiaux sans index RTREE reviennent à un balayage complet et les performances diminuent fortement.</li>
<li><strong>Utilisez un système de coordonnées cohérent.</strong> Toutes les données de localisation doivent utiliser le même système (par exemple, <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). Le mélange des systèmes de coordonnées perturbe les calculs de distance et de confinement.</li>
<li><strong>Choisissez l'opérateur spatial adapté à la requête.</strong> ST_DWITHIN pour les recherches "à X mètres près". ST_CONTAINS ou ST_WITHIN pour les vérifications de géofencing et de confinement.</li>
<li><strong>Les valeurs géométriques NULL sont gérées automatiquement.</strong> Si le champ GEOMETRY est nullable (nullable=True), Milvus ne tient pas compte des valeurs NULL lors des requêtes spatiales. Aucune logique de filtrage supplémentaire n'est nécessaire.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Exigences de déploiement<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour utiliser ces fonctionnalités en production, assurez-vous que votre environnement répond aux exigences suivantes.</p>
<p><strong>1. Version de Milvus</strong></p>
<p>Vous devez exécuter <strong>Milvus 2.6.4 ou une version ultérieure</strong>. Les versions antérieures ne prennent pas en charge DataType.GEOMETRY ou le type d'index <strong>RTREE</strong>.</p>
<p><strong>2. Versions du SDK</strong></p>
<ul>
<li><strong>PyMilvus</strong>: passez à la dernière version (la série <strong>2.6.x</strong> est recommandée). Ceci est nécessaire pour une sérialisation WKT correcte et pour passer des paramètres d'index RTREE.</li>
<li><strong>Java / Go / Node SD</strong>Ks : vérifiez les notes de version de chaque SDK et confirmez qu'ils sont alignés avec les définitions du proto <strong>2.6.4</strong>.</li>
</ul>
<p><strong>3. Bibliothèques de géométrie intégrées</strong></p>
<p>Le serveur Milvus comprend déjà Boost.Geometry et GEOS, vous n'avez donc pas besoin d'installer ces bibliothèques vous-même.</p>
<p><strong>4. Utilisation de la mémoire et planification de la capacité</strong></p>
<p>Les index R-Tree utilisent de la mémoire supplémentaire. Lors de la planification de la capacité, n'oubliez pas de prévoir un budget pour les index géométriques ainsi que pour les index vectoriels tels que HNSW ou IVF. Le champ GEOMETRY prend en charge le stockage en mode mémoire (mmap), ce qui permet de réduire l'utilisation de la mémoire en conservant une partie des données sur le disque.</p>
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
    </button></h2><p>La recherche sémantique basée sur la localisation ne se limite pas à l'ajout d'un filtre géographique à une requête vectorielle. Elle nécessite des types de données spatiales intégrés, des index appropriés et un moteur de recherche capable de traiter les emplacements et les vecteurs ensemble.</p>
<p><strong>Milvus 2.6.4</strong> résout ce problème grâce aux champs <strong>GEOMETRY</strong> natifs et aux index <strong>R-Tree</strong>. Le filtrage spatial et la recherche vectorielle s'exécutent en une seule requête, sur un seul magasin de données. Le R-Tree gère l'élagage spatial rapide tandis que GEOS garantit des résultats exacts.</p>
<p>Pour les applications qui ont besoin d'une recherche en fonction de la localisation, cela élimine la complexité de l'exécution et de la synchronisation de deux systèmes distincts.</p>
<p>Si vous travaillez sur des recherches spatiales et vectorielles sensibles à la localisation ou hybrides, nous serions ravis de connaître votre expérience.</p>
<p><strong>Vous avez des questions sur Milvus ?</strong> Rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou réservez une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours de</a> 20 minutes.</p>
