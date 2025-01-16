---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: >-
  Comparaison des bases de données vectorielles, des bibliothèques de recherche
  vectorielle et des plugins de recherche vectorielle
author: Frank Liu
date: 2023-11-9
desc: >-
  Dans cet article, nous continuerons à explorer le domaine complexe de la
  recherche vectorielle, en comparant les bases de données vectorielles, les
  plugins de recherche vectorielle et les bibliothèques de recherche
  vectorielle.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bonjour à tous - bienvenue dans ce cours sur les bases de données vectorielles !</p>
<p>L'essor de <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> et d'autres grands modèles de langage (LLM) a favorisé la croissance des technologies de recherche vectorielle, avec des bases de données vectorielles spécialisées comme <a href="https://zilliz.com/what-is-milvus">Milvus</a> et <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, des bibliothèques comme <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> et des plugins de recherche vectorielle intégrés dans les bases de données conventionnelles.</p>
<p>Dans notre <a href="https://zilliz.com/learn/what-is-vector-database">précédente série d'articles</a>, nous avons examiné les principes fondamentaux des bases de données vectorielles. Dans cet article, nous continuerons à explorer le domaine complexe de la recherche vectorielle, en comparant les bases de données vectorielles, les plugins de recherche vectorielle et les bibliothèques de recherche vectorielle.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">Qu'est-ce que la recherche vectorielle ?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>La<a href="https://zilliz.com/learn/vector-similarity-search">recherche vectorielle</a>, également connue sous le nom de recherche de similarité vectorielle, est une technique permettant d'extraire les k premiers résultats les plus similaires ou sémantiquement liés à un vecteur de requête donné parmi une vaste collection de données vectorielles denses. Avant d'effectuer des recherches de similarité, nous utilisons des réseaux neuronaux pour transformer des <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a>, telles que du texte, des images, des vidéos et des sons, en vecteurs numériques à haute dimension appelés vecteurs d'intégration. Après avoir généré des vecteurs d'intégration, les moteurs de recherche vectorielle comparent la distance spatiale entre le vecteur d'entrée de la requête et les vecteurs dans les magasins de vecteurs. Plus ils sont proches dans l'espace, plus ils sont similaires.</p>
<p>De nombreuses technologies de recherche vectorielle sont disponibles sur le marché, notamment des bibliothèques d'apprentissage automatique comme NumPy de Python, des bibliothèques de recherche vectorielle comme FAISS, des plugins de recherche vectorielle construits sur des bases de données traditionnelles et des bases de données vectorielles spécialisées comme Milvus et Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Bases de données vectorielles et bibliothèques de recherche vectorielle<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p>Les<a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de données vectorielles spécialisées</a> ne sont pas la seule solution pour les recherches de similarité. Avant l'avènement des bases de données vectorielles, de nombreuses bibliothèques de recherche vectorielle, telles que FAISS, ScaNN et HNSW, étaient utilisées pour la recherche vectorielle.</p>
<p>Les bibliothèques de recherche vectorielle peuvent vous aider à construire rapidement un prototype de système de recherche vectorielle très performant. FAISS, par exemple, est un logiciel libre développé par Meta pour la recherche efficace de similarités et le regroupement de vecteurs denses. FAISS peut traiter des collections de vecteurs de toute taille, même celles qui ne peuvent pas être entièrement chargées en mémoire. En outre, FAISS offre des outils d'évaluation et de réglage des paramètres. Bien qu'écrit en C++, FAISS fournit une interface Python/NumPy.</p>
<p>Cependant, les bibliothèques de recherche vectorielle sont simplement des bibliothèques ANN légères plutôt que des solutions gérées, et leurs fonctionnalités sont limitées. Si votre jeu de données est petit et limité, ces bibliothèques peuvent être suffisantes pour le traitement des données non structurées, même pour les systèmes fonctionnant en production. Cependant, à mesure que la taille des ensembles de données augmente et que le nombre d'utilisateurs augmente, le problème de l'échelle devient de plus en plus difficile à résoudre. En outre, elles ne permettent pas de modifier leurs données d'index et ne peuvent pas être interrogées lors de l'importation de données.</p>
<p>En revanche, les bases de données vectorielles constituent une solution plus optimale pour le stockage et la recherche de données non structurées. Elles peuvent stocker et interroger des millions, voire des milliards de vecteurs, tout en fournissant simultanément des réponses en temps réel ; elles sont hautement évolutives pour répondre aux besoins croissants des utilisateurs.</p>
<p>En outre, les bases de données vectorielles telles que Milvus présentent des caractéristiques beaucoup plus conviviales pour les données structurées/semi-structurées : nébulosité, multi-tenance, évolutivité, etc. Ces caractéristiques apparaîtront clairement lorsque nous approfondirons ce tutoriel.</p>
<p>Elles opèrent également dans une couche d'abstraction totalement différente des bibliothèques de recherche vectorielle - les bases de données vectorielles sont des services à part entière, tandis que les bibliothèques ANN sont destinées à être intégrées dans l'application que vous êtes en train de développer. En ce sens, les bibliothèques ANN sont l'un des nombreux composants sur lesquels les bases de données vectorielles sont construites, de la même manière qu'Elasticsearch est construit sur Apache Lucene.</p>
<p>Pour illustrer l'importance de cette abstraction, examinons l'insertion d'un nouvel élément de données non structurées dans une base de données vectorielle. C'est très facile avec Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>C'est aussi simple que cela - 3 lignes de code. Avec une bibliothèque telle que FAISS ou ScaNN, il n'y a malheureusement pas de moyen facile de le faire sans recréer manuellement l'index entier à certains points de contrôle. Même si c'était possible, les bibliothèques de recherche vectorielle manquent encore d'évolutivité et de multi-location, deux des caractéristiques les plus importantes des bases de données vectorielles.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Bases de données vectorielles et plugins de recherche vectorielle pour les bases de données traditionnelles<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous avons établi la différence entre les bibliothèques de recherche vectorielle et les bases de données vectorielles, voyons en quoi les bases de données vectorielles diffèrent des <strong>plugins de recherche vectorielle</strong>.</p>
<p>Un nombre croissant de bases de données relationnelles traditionnelles et de systèmes de recherche tels que Clickhouse et <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> intègrent des plugins de recherche vectorielle. Elasticsearch 8.0, par exemple, inclut des fonctionnalités d'insertion de vecteurs et de recherche ANN qui peuvent être appelées via des points d'extrémité d'API reposantes. Le problème des plugins de recherche vectorielle devrait être clair comme le jour et la nuit - <strong>ces solutions n'adoptent pas une approche complète de la gestion de l'intégration et de la recherche vectorielle</strong>. Au lieu de cela, ces plugins sont conçus pour être des améliorations au-dessus des architectures existantes, ce qui les rend limités et non optimisés. Développer une application de données non structurées au-dessus d'une base de données traditionnelle reviendrait à essayer d'intégrer des batteries au lithium et des moteurs électriques dans le châssis d'une voiture à essence - ce n'est pas une bonne idée !</p>
<p>Pour illustrer cette situation, revenons à la liste des fonctionnalités qu'une base de données vectorielle devrait mettre en œuvre (voir la première section). Les plugins de recherche vectorielle sont dépourvus de deux de ces caractéristiques - la possibilité de réglage et des API/SDK conviviaux. Je vais continuer à utiliser le moteur ANN d'Elasticsearch comme exemple ; les autres plugins de recherche vectorielle fonctionnent de manière très similaire, je ne vais donc pas aller trop loin dans les détails. Elasticsearch prend en charge le stockage vectoriel via le type de champ de données <code translate="no">dense_vector</code> et permet d'effectuer des requêtes via le type de champ de données <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Le plugin ANN d'Elasticsearch ne prend en charge qu'un seul algorithme d'indexation : Hierarchical Navigable Small Worlds, également connu sous le nom de HNSW (j'aime à penser que le créateur était en avance sur Marvel lorsqu'il s'agissait de populariser le multivers). De plus, seule la distance L2/Euclidienne est supportée comme métrique de distance. C'est un bon début, mais comparons-le à Milvus, une base de données vectorielle à part entière. Utilisation de <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>Bien qu'<a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch et Milvus</a> disposent tous deux de méthodes pour créer des index, insérer des vecteurs d'intégration et effectuer des recherches sur le plus proche voisin, ces exemples montrent clairement que Milvus dispose d'une API de recherche vectorielle plus intuitive (meilleure API pour l'utilisateur) et d'une prise en charge plus large des index vectoriels et des métriques de distance (meilleure adaptabilité). Milvus prévoit également de prendre en charge davantage d'indices vectoriels et de permettre l'interrogation via des instructions de type SQL à l'avenir, ce qui améliorera encore l'adaptabilité et la facilité d'utilisation.</p>
<p>Nous venons de passer en revue une bonne partie du contenu. Cette section était certes assez longue, mais pour ceux qui l'ont survolée, voici un résumé rapide : Milvus est meilleur que les plugins de recherche vectorielle car Milvus a été conçu dès le départ comme une base de données vectorielle, ce qui lui permet d'offrir un ensemble de fonctionnalités plus riche et une architecture mieux adaptée aux données non structurées.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">Comment choisir parmi les différentes technologies de recherche vectorielle ?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Toutes les bases de données vectorielles ne se valent pas ; chacune possède des caractéristiques uniques qui répondent à des applications spécifiques. Les bibliothèques et les plugins de recherche vectorielle sont conviviaux et idéaux pour gérer des environnements de production à petite échelle avec des millions de vecteurs. Si la taille de vos données est faible et que vous n'avez besoin que d'une fonctionnalité de recherche vectorielle de base, ces technologies sont suffisantes pour votre entreprise.</p>
<p>Cependant, une base de données vectorielle spécialisée devrait être votre premier choix pour les entreprises à forte intensité de données traitant des centaines de millions de vecteurs et exigeant des réponses en temps réel. Milvus, par exemple, gère sans effort des milliards de vecteurs, offrant des vitesses d'interrogation fulgurantes et de riches fonctionnalités. En outre, les solutions entièrement gérées comme Zilliz s'avèrent encore plus avantageuses, car elles vous libèrent des défis opérationnels et vous permettent de vous concentrer exclusivement sur vos activités principales.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Jetez un coup d'œil aux cours Vector Database 101<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Introduction aux données non structurées</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">Qu'est-ce qu'une base de données vectorielle ?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Comparaison des bases de données vectorielles, des bibliothèques de recherche vectorielle et des plugins de recherche vectorielle</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Introduction à Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Démarrage rapide de Milvus</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Introduction à la recherche par similarité vectorielle</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Notions de base sur l'index vectoriel et l'index de fichiers inversé</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Quantification scalaire et quantification par produit</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Petits mondes hiérarchiques navigables (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Voisins les plus proches approximatifs Oh Yeah (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Choisir le bon index vectoriel pour votre projet</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN et l'algorithme de Vamana</a></li>
</ol>
