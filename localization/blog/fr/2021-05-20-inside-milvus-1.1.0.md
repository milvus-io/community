---
id: inside-milvus-1.1.0.md
title: Nouvelles fonctionnalités
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  Milvus v1.1.0 est arrivé ! Les nouvelles fonctionnalités, les améliorations et
  les corrections de bugs sont disponibles dès maintenant.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>A l'intérieur de Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> est un projet permanent de logiciel libre (OSS) visant à construire la base de données vectorielles la plus rapide et la plus fiable au monde. Les nouvelles fonctionnalités de Milvus v1.1.0 sont les premières de nombreuses mises à jour à venir, grâce au soutien à long terme de la communauté open-source et au parrainage de Zilliz. Cet article de blog couvre les nouvelles fonctionnalités, les améliorations et les corrections de bogues incluses dans Milvus v1.1.0.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#new-features">Nouvelles fonctionnalités</a></li>
<li><a href="#improvements">Améliorations</a></li>
<li><a href="#bug-fixes">Corrections de bogues</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">Nouvelles fonctionnalités<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme tout projet OSS, Milvus est un travail perpétuel en cours. Nous nous efforçons d'écouter nos utilisateurs et la communauté open-source afin de donner la priorité aux fonctionnalités les plus importantes. La dernière mise à jour, Milvus v1.1.0, offre les nouvelles fonctionnalités suivantes :</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Spécification des partitions avec les appels de méthode <code translate="no">get_entity_by_id()</code> </h3><p>Pour accélérer davantage la recherche de similarité vectorielle, Milvus 1.1.0 prend désormais en charge l'extraction de vecteurs à partir d'une partition spécifiée. En général, Milvus prend en charge l'interrogation de vecteurs par le biais d'ID de vecteur spécifiés. Dans Milvus 1.0, l'appel de la méthode <code translate="no">get_entity_by_id()</code> permet de rechercher l'ensemble de la collection, ce qui peut prendre du temps pour les grands ensembles de données. Comme le montre le code ci-dessous, <code translate="no">GetVectorsByIdHelper</code> utilise une structure <code translate="no">FileHolder</code> pour parcourir en boucle et trouver un vecteur spécifique.</p>
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
<p>Toutefois, cette structure n'est filtrée par aucune partition dans <code translate="no">FilesByTypeEx()</code>. Dans Milvus v1.1.0, il est possible pour le système de transmettre des noms de partition à la boucle <code translate="no">GetVectorsIdHelper</code> de sorte que <code translate="no">FileHolder</code> ne contienne que des segments provenant des partitions spécifiées. En d'autres termes, si vous savez exactement à quelle partition appartient le vecteur à rechercher, vous pouvez spécifier le nom de la partition dans un appel de méthode <code translate="no">get_entity_by_id()</code> pour accélérer le processus de recherche.</p>
<p>Nous avons non seulement apporté des modifications au code contrôlant les requêtes du système au niveau du serveur Milvus, mais nous avons également mis à jour tous nos SDK (Python, Go, C++, Java et RESTful) en ajoutant un paramètre permettant de spécifier les noms des partitions. Par exemple, dans pymilvus, la définition de <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> est remplacée par <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Spécifier les partitions avec les appels de méthode <code translate="no">delete_entity_by_id()</code> </h3><p>Pour rendre la gestion des vecteurs plus efficace, Milvus v1.1.0 prend désormais en charge la spécification des noms de partition lors de la suppression d'un vecteur dans une collection. Dans Milvus 1.0, les vecteurs d'une collection ne peuvent être supprimés que par ID. Lors de l'appel de la méthode de suppression, Milvus examine tous les vecteurs de la collection. Cependant, il est beaucoup plus efficace de n'analyser que les partitions pertinentes lorsque l'on travaille avec des ensembles de données massifs d'un million, d'un milliard, voire d'un trillion de vecteurs. Comme pour la nouvelle fonctionnalité permettant de spécifier des partitions avec les appels de méthode <code translate="no">get_entity_by_id()</code>, des modifications ont été apportées au code Milvus selon la même logique.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">Nouvelle méthode <code translate="no">release_collection()</code></h3><p>Pour libérer la mémoire utilisée par Milvus pour charger les collections au moment de l'exécution, une nouvelle méthode <code translate="no">release_collection()</code> a été ajoutée dans Milvus v1.1.0 pour décharger manuellement des collections spécifiques du cache.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Améliorations<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Bien que les nouvelles fonctionnalités fassent généralement fureur, il est également important d'améliorer ce que nous avons déjà. Voici les mises à jour et autres améliorations générales par rapport à Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Amélioration des performances de l'appel à la méthode <code translate="no">get_entity_by_id()</code> </h3><p>Le tableau ci-dessous est une comparaison des performances de recherche vectorielle entre Milvus v1.0 et Milvus v1.1.0 :</p>
<blockquote>
<p>CPU : Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Taille du fichier de segment = 1024 Mo <br/>Nombre de lignes = 1 000 000 <br/>Dim = 128</p>
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
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib mis à niveau vers v0.5.0</h3><p>Milvus adopte plusieurs bibliothèques d'index largement utilisées, notamment Faiss, NMSLIB, Hnswlib et Annoy, afin de simplifier le processus de sélection du type d'index approprié pour un scénario donné.</p>
<p>Hnswlib a été mis à niveau de la version 0.3.0 à la version 0.5.0 dans Milvus 1.1.0 en raison d'un bogue détecté dans la version précédente. De plus, la mise à niveau de Hnswlib améliore les performances de <code translate="no">addPoint()</code> dans la construction de l'index.</p>
<p>Un développeur de Zilliz a créé une pull request (PR) pour améliorer les performances de Hnswlib lors de la construction d'index dans Milvus. Voir <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> pour plus de détails.</p>
<p>Le tableau ci-dessous est une comparaison des performances de <code translate="no">addPoint()</code> entre Hnswlib 0.5.0 et la PR proposée :</p>
<blockquote>
<p>CPU : Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Dataset : sift_1M (row count = 1000000, dim = 128, space = L2)</p>
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
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Amélioration des performances de l'apprentissage de l'index IVF</h3><p>La création d'un index comprend la formation, l'insertion et l'écriture des données sur le disque. Milvus 1.1.0 améliore la composante d'entraînement de la construction d'index. Le graphique ci-dessous est une comparaison des performances de formation d'index IVF entre Milvus 1.0 et Milvus 1.1.0 :</p>
<blockquote>
<p>CPU : Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Dataset : sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
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
<h2 id="Bug-fixes" class="common-anchor-header">Correction de bogues<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons également corrigé quelques bogues pour rendre Milvus plus stable et plus efficace lors de la gestion d'ensembles de données vectorielles. Voir les <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">problèmes corrigés</a> pour plus de détails.</p>
