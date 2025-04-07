---
id: what-is-vector-database-and-how-it-works.md
title: Qu'est-ce qu'une base de données vectorielle et comment fonctionne-t-elle ?
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Une base de données vectorielle permet de stocker, d'indexer et de rechercher
  les encastrements vectoriels générés par des modèles d'apprentissage
  automatique pour une recherche rapide d'informations et de similitudes.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>Une base de données vectorielle indexe et stocke les encastrements vectoriels pour une recherche rapide et une recherche de similarité, avec des fonctionnalités telles que les opérations CRUD, le filtrage des métadonnées et la mise à l'échelle horizontale, conçues spécifiquement pour les applications d'intelligence artificielle.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Introduction : L'essor des bases de données vectorielles à l'ère de l'IA<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans les premiers temps d'ImageNet, il a fallu 25 000 conservateurs humains pour étiqueter manuellement l'ensemble de données. Ce chiffre stupéfiant met en évidence un défi fondamental de l'IA : la catégorisation manuelle de données non structurées n'est tout simplement pas extensible. Avec des milliards d'images, de vidéos, de documents et de fichiers audio générés chaque jour, un changement de paradigme s'imposait dans la manière dont les ordinateurs comprennent et interagissent avec le contenu.</p>
<p>Les systèmes<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">traditionnels</a> de<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">bases de données relationnelles</a> excellent dans la gestion de données structurées avec des formats prédéfinis et dans l'exécution d'opérations de recherche précises. En revanche, les bases de données vectorielles sont spécialisées dans le stockage et la recherche de types de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées </a>, telles que les images, le son, les vidéos et le contenu textuel, par le biais de représentations numériques à haute dimension connues sous le nom d'encastrements vectoriels. Les bases de données vectorielles prennent en charge de <a href="https://zilliz.com/glossary/large-language-models-(llms)">grands modèles de langage</a> en permettant une recherche et une gestion efficaces des données. Les bases de données vectorielles modernes surpassent les systèmes traditionnels de 2 à 10 fois grâce à l'optimisation matérielle (AVX512, SIMD, GPU, NVMe SSD), à des algorithmes de recherche hautement optimisés (HNSW, IVF, DiskANN) et à une conception du stockage orientée colonnes. Leur architecture découplée et native pour le cloud permet une mise à l'échelle indépendante des composants de recherche, d'insertion de données et d'indexation, ce qui permet aux systèmes de traiter efficacement des milliards de vecteurs tout en maintenant les performances pour les applications d'IA d'entreprise dans des sociétés telles que Salesforce, PayPal, eBay et NVIDIA.</p>
<p>Cela représente ce que les experts appellent un " fossé sémantique " - les bases de données traditionnelles fonctionnent sur des correspondances exactes et des relations prédéfinies, alors que la compréhension humaine du contenu est nuancée, contextuelle et multidimensionnelle. Ce fossé devient de plus en plus problématique au fur et à mesure que les applications de l'IA se développent :</p>
<ul>
<li><p>trouver des similitudes conceptuelles plutôt que des correspondances exactes</p></li>
<li><p>comprendre les relations contextuelles entre différents éléments de contenu</p></li>
<li><p>Saisir l'essence sémantique de l'information au-delà des mots-clés</p></li>
<li><p>traiter des données multimodales dans un cadre unifié.</p></li>
</ul>
<p>Les bases de données vectorielles sont apparues comme la technologie essentielle pour combler ce fossé, devenant un composant essentiel de l'infrastructure moderne de l'IA. Elles améliorent les performances des modèles d'apprentissage automatique en facilitant des tâches telles que le regroupement et la classification.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Comprendre les emboîtements vectoriels : La base<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">Les encastrements vectoriels</a> servent de pont critique pour combler le fossé sémantique. Ces représentations numériques à haute dimension capturent l'essence sémantique des données non structurées sous une forme que les ordinateurs peuvent traiter efficacement. Les modèles d'intégration modernes transforment le contenu brut - qu'il s'agisse de texte, d'images ou d'audio - en vecteurs denses où les concepts similaires sont regroupés dans l'espace vectoriel, quelles que soient les différences au niveau de la surface.</p>
<p>Par exemple, des modèles d'intégration correctement construits positionnent des concepts tels que "automobile", "voiture" et "véhicule" à proximité les uns des autres dans l'espace vectoriel, bien qu'ils aient des formes lexicales différentes. Cette propriété permet à la <a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a>, aux <a href="https://zilliz.com/vector-database-use-cases/recommender-system">systèmes de recommandation</a> et aux applications d'intelligence artificielle de comprendre le contenu au-delà de la simple correspondance des formes.</p>
<p>La puissance des enchâssements s'étend à toutes les modalités. Les bases de données vectorielles avancées prennent en charge différents types de données non structurées (texte, images, audio) dans un système unifié, ce qui permet d'effectuer des recherches multimodales et d'établir des relations qu'il était auparavant impossible de modéliser efficacement. Ces capacités des bases de données vectorielles sont essentielles pour les technologies basées sur l'intelligence artificielle, telles que les chatbots et les systèmes de reconnaissance d'images, qui prennent en charge des applications avancées telles que la recherche sémantique et les systèmes de recommandation.</p>
<p>Cependant, le stockage, l'indexation et l'extraction d'embeddings à grande échelle présentent des défis informatiques uniques que les bases de données traditionnelles n'ont pas été conçues pour relever.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Bases de données vectorielles : Concepts de base<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles représentent un changement de paradigme dans la manière dont nous stockons et interrogeons les données non structurées. Contrairement aux systèmes de bases de données relationnelles traditionnels qui excellent dans la gestion de données structurées avec des formats prédéfinis, les bases de données vectorielles sont spécialisées dans la gestion de données non structurées par le biais de représentations numériques vectorielles.</p>
<p>À la base, les bases de données vectorielles sont conçues pour résoudre un problème fondamental : permettre des recherches de similarités efficaces dans des ensembles massifs de données non structurées. Elles y parviennent grâce à trois éléments clés :</p>
<p><strong>Vector Embeddings</strong>: Représentations numériques à haute dimension qui capturent le sens sémantique des données non structurées (texte, images, audio, etc.).</p>
<p><strong>Indexation spécialisée</strong>: Algorithmes optimisés pour les espaces vectoriels à haute dimension qui permettent des recherches approximatives rapides. La base de données vectorielle indexe les vecteurs pour améliorer la rapidité et l'efficacité des recherches de similarité, en utilisant divers algorithmes ML pour créer des index sur les encastrements vectoriels.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Mesures de distance</strong></a>: Fonctions mathématiques qui quantifient la similarité entre les vecteurs.</p>
<p>L'opération principale d'une base de données vectorielle est la requête <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">"k-nearest neighbors</a> " (KNN), qui trouve les k vecteurs les plus similaires à un vecteur de requête donné. Pour les applications à grande échelle, ces bases de données mettent généralement en œuvre des algorithmes de <a href="https://zilliz.com/glossary/anns">plus proche voisin approximatif</a> (ANN), qui échangent une petite quantité de précision contre des gains significatifs en termes de vitesse de recherche.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fondements mathématiques de la similarité vectorielle</h3><p>Pour comprendre les bases de données vectorielles, il faut saisir les principes mathématiques qui sous-tendent la similarité vectorielle. Voici les concepts fondamentaux :</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Espaces vectoriels et encastrements</h3><p>Une <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">intégration vectorielle</a> est un tableau de longueur fixe de nombres à virgule flottante (de 100 à 32 768 dimensions !) qui représente des données non structurées dans un format numérique. Ces encastrements positionnent les éléments similaires plus près les uns des autres dans un espace vectoriel à haute dimension.</p>
<p>Par exemple, les mots "roi" et "reine" auraient des représentations vectorielles plus proches l'une de l'autre que l'une des deux ne l'est de "automobile" dans un espace d'intégration de mots bien formé.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Métriques de distance</h3><p>Le choix de la métrique de distance affecte fondamentalement la manière dont la similarité est calculée. Les mesures de distance les plus courantes sont les suivantes</p>
<ol>
<li><p><strong>La distance euclidienne</strong>: La distance en ligne droite entre deux points dans l'espace euclidien.</p></li>
<li><p><strong>Similitude du cosinus</strong>: Mesure le cosinus de l'angle entre deux vecteurs, en se concentrant sur l'orientation plutôt que sur la magnitude.</p></li>
<li><p><strong>Produit de point</strong>: Pour les vecteurs normalisés, représente le degré d'alignement de deux vecteurs.</p></li>
<li><p><strong>Distance de Manhattan (norme L1)</strong>: Somme des différences absolues entre les coordonnées.</p></li>
</ol>
<p>Des cas d'utilisation différents peuvent nécessiter des mesures de distance différentes. Par exemple, la similarité en cosinus donne souvent de bons résultats pour l'intégration de textes, tandis que la distance euclidienne peut être mieux adaptée à certains types d'<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">intégration d'images</a>.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Similitude sémantique</a> entre vecteurs dans un espace vectoriel</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>Similitude sémantique entre vecteurs dans un espace vectoriel</span> </span></p>
<p>La compréhension de ces fondements mathématiques conduit à une question importante concernant la mise en œuvre : Il suffit donc d'ajouter un index vectoriel à n'importe quelle base de données, n'est-ce pas ?</p>
<p>Il ne suffit pas d'ajouter un index vectoriel à une base de données relationnelle, ni d'utiliser une <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">bibliothèque d'index vectoriels</a> autonome. Bien que les index vectoriels permettent de trouver efficacement des vecteurs similaires, ils ne disposent pas de l'infrastructure nécessaire aux applications de production :</p>
<ul>
<li><p>Ils ne fournissent pas d'opérations CRUD pour gérer les données vectorielles</p></li>
<li><p>Ils ne disposent pas de capacités de stockage et de filtrage des métadonnées</p></li>
<li><p>Ils n'offrent pas de mise à l'échelle, de réplication ou de tolérance aux pannes intégrées.</p></li>
<li><p>Elles nécessitent une infrastructure personnalisée pour la persistance et la gestion des données.</p></li>
</ul>
<p>Les bases de données vectorielles sont apparues pour remédier à ces limitations, en fournissant des capacités complètes de gestion des données conçues spécifiquement pour les encastrements vectoriels. Elles combinent la puissance sémantique de la recherche vectorielle avec les capacités opérationnelles des systèmes de base de données.</p>
<p>Contrairement aux bases de données traditionnelles qui fonctionnent sur la base de correspondances exactes, les bases de données vectorielles se concentrent sur la recherche sémantique, c'est-à-dire sur la recherche des vecteurs qui sont "les plus similaires" à un vecteur d'interrogation selon des mesures de distance spécifiques. Cette différence fondamentale est à l'origine de l'architecture et des algorithmes uniques qui alimentent ces systèmes spécialisés.</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">Architecture des bases de données vectorielles : Un cadre technique<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles modernes mettent en œuvre une architecture multicouche sophistiquée qui sépare les préoccupations, permet l'évolutivité et garantit la maintenabilité. Ce cadre technique va bien au-delà de simples index de recherche pour créer des systèmes capables de gérer des charges de travail d'IA de production. Les bases de données vectorielles traitent et récupèrent des informations pour les applications d'IA et de ML, en utilisant des algorithmes de recherche approximative du plus proche voisin, en convertissant divers types de données brutes en vecteurs et en gérant efficacement divers types de données par le biais de recherches sémantiques.</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">Architecture à quatre niveaux</h3><p>Une base de données vectorielles de production se compose généralement de quatre couches architecturales principales :</p>
<ol>
<li><p><strong>Couche de stockage</strong>: Elle gère le stockage permanent des données vectorielles et des métadonnées, met en œuvre des stratégies d'encodage et de compression spécialisées et optimise les schémas d'E/S pour un accès spécifique aux vecteurs.</p></li>
<li><p><strong>Couche d'indexation</strong>: Elle gère plusieurs algorithmes d'indexation, leur création et leurs mises à jour, et met en œuvre des optimisations matérielles spécifiques pour améliorer les performances.</p></li>
<li><p><strong>Couche d'interrogation</strong>: Traite les requêtes entrantes, détermine les stratégies d'exécution, gère le traitement des résultats et met en place des caches pour les requêtes répétées.</p></li>
<li><p><strong>Couche service</strong>: Gère les connexions des clients, s'occupe de l'acheminement des requêtes, assure la surveillance et la journalisation, et met en œuvre la sécurité et la multi-location.</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">Flux de travail d'une recherche vectorielle</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>Flux de travail complet d'une opération de recherche vectorielle.png</span> </span></p>
<p>La mise en œuvre d'une base de données vectorielle typique suit ce flux de travail :</p>
<ol>
<li><p>Un modèle d'apprentissage automatique transforme les données non structurées (texte, images, audio) en vecteurs intégrés (vector embeddings)</p></li>
<li><p>Ces encastrements vectoriels sont stockés dans la base de données avec les métadonnées pertinentes.</p></li>
<li><p>Lorsqu'un utilisateur effectue une requête, celle-ci est convertie en un vecteur intégré à l'aide du <em>même</em> modèle.</p></li>
<li><p>La base de données compare le vecteur de la requête aux vecteurs stockés à l'aide d'un algorithme approximatif du plus proche voisin.</p></li>
<li><p>Le système renvoie les K résultats les plus pertinents sur la base de la similarité des vecteurs.</p></li>
<li><p>Un post-traitement optionnel peut appliquer des filtres supplémentaires ou un reclassement.</p></li>
</ol>
<p>Ce pipeline permet une recherche sémantique efficace dans des collections massives de données non structurées, ce qui serait impossible avec les approches traditionnelles des bases de données.</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">Cohérence des bases de données vectorielles</h4><p>Garantir la cohérence dans les bases de données vectorielles distribuées est un défi en raison du compromis entre les performances et l'exactitude. Alors que la cohérence éventuelle est courante dans les systèmes à grande échelle, des modèles de cohérence solides sont nécessaires pour les applications critiques telles que la détection des fraudes et les recommandations en temps réel. Des techniques telles que les écritures basées sur le quorum et le consensus distribué (par exemple, <a href="https://zilliz.com/learn/raft-or-not">Raft</a>, Paxos) garantissent l'intégrité des données sans compromis excessif en termes de performances.</p>
<p>Les implémentations de production adoptent une architecture de stockage partagé avec désagrégation du stockage et de l'informatique. Cette séparation suit le principe de la désagrégation du plan de données et du plan de contrôle, chaque couche étant extensible de manière indépendante pour une utilisation optimale des ressources.</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">Gestion des connexions, de la sécurité et du multitenariat</h3><p>Ces bases de données étant utilisées dans des environnements multi-utilisateurs et multi-locataires, la sécurisation des données et la gestion du contrôle d'accès sont essentielles au maintien de la confidentialité.</p>
<p>Les mesures de sécurité telles que le cryptage (au repos et en transit) protègent les données sensibles, telles que les incorporations et les métadonnées. L'authentification et l'autorisation garantissent que seuls les utilisateurs autorisés peuvent accéder au système, avec des permissions fines pour gérer l'accès à des données spécifiques.</p>
<p>Le contrôle d'accès définit les rôles et les autorisations pour restreindre l'accès aux données. Ceci est particulièrement important pour les bases de données stockant des informations sensibles telles que des données clients ou des modèles d'IA propriétaires.</p>
<p>La multitenance implique d'isoler les données de chaque locataire pour empêcher tout accès non autorisé tout en permettant le partage des ressources. Pour ce faire, on utilise le sharding, le partitionnement ou la sécurité au niveau des lignes afin de garantir un accès évolutif et sécurisé pour différentes équipes ou différents clients.</p>
<p>Les systèmes externes de gestion des identités et des accès (IAM) s'intègrent aux bases de données vectorielles pour appliquer les politiques de sécurité et garantir la conformité aux normes industrielles.</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">Avantages des bases de données vectorielles<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles offrent plusieurs avantages par rapport aux bases de données traditionnelles, ce qui en fait un choix idéal pour le traitement des données vectorielles. Voici quelques-uns des principaux avantages :</p>
<ol>
<li><p><strong>Recherche efficace de similitudes</strong>: L'une des principales caractéristiques des bases de données vectorielles est leur capacité à effectuer des recherches sémantiques efficaces. Contrairement aux bases de données traditionnelles qui s'appuient sur des correspondances exactes, les bases de données vectorielles excellent dans la recherche de points de données similaires à un vecteur d'interrogation donné. Cette capacité est cruciale pour des applications telles que les systèmes de recommandation, où la recherche d'éléments similaires aux interactions passées d'un utilisateur peut améliorer de manière significative l'expérience de l'utilisateur.</p></li>
<li><p><strong>Gestion de données à haute dimension</strong>: Les bases de données vectorielles sont spécialement conçues pour gérer efficacement les données à haute dimension. Elles sont donc particulièrement adaptées aux applications de traitement du langage naturel, de <a href="https://zilliz.com/learn/what-is-computer-vision">vision par ordinateur</a> et de génomique, où les données existent souvent dans des espaces à haute dimension. En tirant parti d'algorithmes d'indexation et de recherche avancés, les bases de données vectorielles peuvent rapidement retrouver des points de données pertinents, même dans des ensembles de données complexes à encastrement vectoriel.</p></li>
<li><p><strong>Évolutivité</strong>: L'évolutivité est une exigence essentielle pour les applications modernes d'intelligence artificielle, et les bases de données vectorielles sont conçues pour évoluer efficacement. Qu'elles traitent des millions ou des milliards de vecteurs, les bases de données vectorielles peuvent répondre aux exigences croissantes des applications d'IA grâce à une mise à l'échelle horizontale. Ainsi, les performances restent constantes même lorsque les volumes de données augmentent.</p></li>
<li><p><strong>Flexibilité</strong>: Les bases de données vectorielles offrent une flexibilité remarquable en termes de représentation des données. Elles peuvent stocker et gérer différents types de données, y compris des caractéristiques numériques, des incrustations de texte ou d'images, et même des données complexes telles que des structures moléculaires. Cette polyvalence fait des bases de données vectorielles un outil puissant pour un large éventail d'applications, de l'analyse de texte à la recherche scientifique.</p></li>
<li><p><strong>Applications en temps réel</strong>: De nombreuses bases de données vectorielles sont optimisées pour l'interrogation en temps réel ou quasi réel. Ceci est particulièrement important pour les applications qui nécessitent des réponses rapides, telles que la détection des fraudes, les recommandations en temps réel et les systèmes d'intelligence artificielle interactifs. La possibilité d'effectuer des recherches rapides par similarité permet à ces applications de fournir des résultats pertinents en temps voulu.</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">Cas d'utilisation des bases de données vectorielles<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles ont un large éventail d'applications dans divers secteurs, ce qui démontre leur polyvalence et leur puissance. Voici quelques cas d'utilisation notables :</p>
<ol>
<li><p><strong>Traitement du langage naturel</strong>: Dans le domaine du traitement du langage naturel (NLP), les bases de données vectorielles jouent un rôle crucial. Elles sont utilisées pour des tâches telles que la classification des textes, l'analyse des sentiments et la traduction. En convertissant le texte en vecteurs à haute dimension, les bases de données vectorielles permettent des recherches de similarité et une compréhension sémantique efficaces, améliorant ainsi les performances des <a href="https://zilliz.com/learn/7-nlp-models">modèles de traitement du langage naturel</a>.</p></li>
<li><p><strong>Vision par ordinateur</strong>: Les bases de données vectorielles sont également largement utilisées dans les applications de vision par ordinateur. Des tâches telles que la reconnaissance d'images, la <a href="https://zilliz.com/learn/what-is-object-detection">détection d'objets</a> et la segmentation d'images bénéficient de la capacité des bases de données vectorielles à gérer des images à haute dimension. Cela permet une récupération rapide et précise d'images visuellement similaires, ce qui rend les bases de données vectorielles indispensables dans des domaines tels que la conduite autonome, l'imagerie médicale et la gestion des actifs numériques.</p></li>
<li><p><strong>Génomique</strong>: en génomique, les bases de données vectorielles sont utilisées pour stocker et analyser les séquences génétiques, les structures protéiques et d'autres données moléculaires. La nature hautement dimensionnelle de ces données fait des bases de données vectorielles un choix idéal pour la gestion et l'interrogation de vastes ensembles de données génomiques. Les chercheurs peuvent effectuer des recherches vectorielles pour trouver des séquences génétiques présentant des similitudes, ce qui facilite la découverte de marqueurs génétiques et la compréhension de processus biologiques complexes.</p></li>
<li><p><strong>Systèmes de recommandation</strong>: Les bases de données vectorielles sont la pierre angulaire des systèmes de recommandation modernes. En stockant les interactions des utilisateurs et les caractéristiques des articles sous forme de vecteurs, ces bases de données peuvent rapidement identifier les articles similaires à ceux avec lesquels l'utilisateur a déjà interagi. Cette capacité améliore la précision et la pertinence des recommandations, ce qui accroît la satisfaction et l'engagement des utilisateurs.</p></li>
<li><p><strong>Chatbots et assistants virtuels</strong>: Les bases de données vectorielles sont utilisées dans les chatbots et les assistants virtuels pour fournir des réponses contextuelles en temps réel aux questions des utilisateurs. En convertissant les données de l'utilisateur en vecteurs, ces systèmes peuvent effectuer des recherches de similarité pour trouver les réponses les plus pertinentes. Les chatbots et les assistants virtuels peuvent ainsi fournir des réponses plus précises et plus adaptées au contexte, ce qui améliore l'expérience globale de l'utilisateur.</p></li>
</ol>
<p>En exploitant les capacités uniques des bases de données vectorielles, les entreprises de divers secteurs peuvent créer des applications d'IA plus intelligentes, plus réactives et plus évolutives.</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">Algorithmes de recherche vectorielle : De la théorie à la pratique<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles nécessitent des <a href="https://zilliz.com/learn/vector-index">algorithmes d'</a> indexation spécialisés pour permettre une recherche de similarité efficace dans des espaces à haute dimension. Le choix de l'algorithme a un impact direct sur la précision, la vitesse, l'utilisation de la mémoire et l'évolutivité.</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">Approches basées sur les graphes</h3><p><strong>HNSW (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>Hierarchical Navigable Small World</strong></a><strong>)</strong> crée des structures navigables en connectant des vecteurs similaires, ce qui permet une traversée efficace lors de la recherche. HNSW limite les connexions maximales par nœud et la portée de la recherche afin d'équilibrer les performances et la précision, ce qui en fait l'un des algorithmes les plus utilisés pour la recherche de similarités vectorielles.</p>
<p><strong>Cagra</strong> est un index basé sur les graphes, optimisé spécifiquement pour l'accélération GPU. Il construit des structures de graphe navigables qui s'alignent sur les modèles de traitement des GPU, permettant des comparaisons vectorielles massivement parallèles. Ce qui rend Cagra particulièrement efficace, c'est sa capacité à équilibrer le rappel et la performance grâce à des paramètres configurables tels que le degré du graphe et la largeur de la recherche. L'utilisation de GPU d'inférence avec Cagra peut être plus rentable qu'un matériel d'entraînement coûteux tout en offrant un débit élevé, en particulier pour les collections vectorielles à grande échelle. Toutefois, il convient de noter que les index GPU tels que Cagra ne réduisent pas nécessairement la latence par rapport aux index CPU, à moins qu'ils ne soient soumis à une forte pression de requête.</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">Techniques de quantification</h3><p>La<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>quantification par produit (PQ)</strong></a> décompose les vecteurs à haute dimension en sous-vecteurs plus petits, en quantifiant chacun d'entre eux séparément. Cette technique permet de réduire considérablement les besoins en stockage (souvent de plus de 90 %), mais entraîne une certaine perte de précision.</p>
<p>La<strong>quantification scalaire (SQ)</strong> convertit les nombres flottants de 32 bits en nombres entiers de 8 bits, ce qui réduit l'utilisation de la mémoire de 75 % avec un impact minimal sur la précision.</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">Indexation sur disque : Une mise à l'échelle rentable</h3><p>Pour les collections de vecteurs à grande échelle (plus de 100 millions de vecteurs), le coût des index en mémoire devient prohibitif. Par exemple, 100 millions de vecteurs à 1024 dimensions nécessiteraient environ 400 Go de RAM. C'est là que les algorithmes d'indexation sur disque tels que DiskANN offrent des avantages considérables en termes de coûts.</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a>, basé sur l'algorithme graphique Vamana, permet une recherche vectorielle efficace tout en stockant la majeure partie de l'index sur des disques SSD NVMe plutôt que dans la RAM. Cette approche offre plusieurs avantages en termes de coûts :</p>
<ul>
<li><p><strong>Coûts matériels réduits</strong>: Les organisations peuvent déployer la recherche vectorielle à grande échelle en utilisant du matériel de base avec des configurations de RAM modestes.</p></li>
<li><p><strong>Réduction des dépenses opérationnelles</strong>: Moins de RAM signifie moins de consommation d'énergie et de coûts de refroidissement dans les centres de données.</p></li>
<li><p><strong>Évolution linéaire des coûts</strong>: Les coûts de mémoire augmentent de façon linéaire avec le volume de données, tandis que les performances restent relativement stables.</p></li>
<li><p><strong>Modèles d'E/S optimisés</strong>: La conception spécialisée de DiskANN minimise les lectures sur disque grâce à des stratégies de traversée de graphe minutieuses.</p></li>
</ul>
<p>La contrepartie est généralement une augmentation modeste de la latence des requêtes (souvent seulement 2 à 3 ms) par rapport aux approches purement en mémoire, ce qui est acceptable pour de nombreux cas d'utilisation en production.</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">Types d'index spécialisés</h3><p>Les<strong>index d'intégration binaire</strong> sont spécialisés dans la vision artificielle, les empreintes d'images et les systèmes de recommandation où les données peuvent être représentées sous forme de caractéristiques binaires. Ces index répondent à différents besoins d'application. Pour la déduplication d'images, le tatouage numérique et la détection des droits d'auteur, où la correspondance exacte est essentielle, les index binaires optimisés permettent une détection précise des similitudes. Pour les systèmes de recommandation à haut débit, la recherche d'images basée sur le contenu et la mise en correspondance de caractéristiques à grande échelle, où la vitesse est prioritaire par rapport à un rappel parfait, les index binaires offrent des avantages exceptionnels en termes de performances.</p>
<p>Les<strong>index de vecteurs épars</strong> sont optimisés pour les vecteurs dont la plupart des éléments sont des zéros, avec seulement quelques valeurs non nulles. Contrairement aux vecteurs denses (où la plupart ou toutes les dimensions contiennent des valeurs significatives), les vecteurs épars représentent efficacement les données comportant de nombreuses dimensions mais peu de caractéristiques actives. Cette représentation est particulièrement courante dans le traitement de texte, où un document peut n'utiliser qu'un petit sous-ensemble de tous les mots possibles d'un vocabulaire. Les index de vecteurs épars excellent dans les tâches de traitement du langage naturel telles que la recherche sémantique de documents, l'interrogation en texte intégral et la modélisation de sujets. Ces index sont particulièrement utiles pour la recherche en entreprise dans de grandes collections de documents, la recherche de documents juridiques où des termes et des concepts spécifiques doivent être localisés efficacement, et les plates-formes de recherche universitaire qui indexent des millions d'articles avec une terminologie spécialisée.</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">Capacités d'interrogation avancées<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>Au cœur des bases de données vectorielles se trouve leur capacité à effectuer des recherches sémantiques efficaces. Les capacités de recherche vectorielle vont de la simple mise en correspondance des similarités aux techniques avancées d'amélioration de la pertinence et de la diversité.</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">Recherche ANN de base</h3><p>La recherche ANN (Approximate Nearest Neighbor) est la méthode de recherche fondamentale des bases de données vectorielles. Contrairement à la recherche exacte par k-Nearest Neighbors (kNN), qui compare un vecteur interrogé à tous les vecteurs de la base de données, la recherche ANN utilise des structures d'indexation pour identifier rapidement un sous-ensemble de vecteurs susceptibles d'être les plus similaires, ce qui améliore considérablement les performances.</p>
<p>Les principaux éléments de la recherche ANN sont les suivants</p>
<ul>
<li><p><strong>Les vecteurs de requête</strong>: La représentation vectorielle de ce que vous recherchez.</p></li>
<li><p>Les<strong>structures d'index</strong>: Structures de données préconstruites qui organisent les vecteurs en vue d'une recherche efficace.</p></li>
<li><p><strong>Types de métriques</strong>: Fonctions mathématiques telles que Euclide (L2), Cosinus ou Produit intérieur, qui mesurent la similarité entre les vecteurs.</p></li>
<li><p><strong>Résultats Top-K</strong>: Le nombre spécifié de vecteurs les plus similaires à retourner.</p></li>
</ul>
<p>Les bases de données vectorielles offrent des optimisations pour améliorer l'efficacité de la recherche :</p>
<ul>
<li><p><strong>Recherche vectorielle en bloc</strong>: Recherche avec plusieurs vecteurs d'interrogation en parallèle.</p></li>
<li><p><strong>Recherche partitionnée</strong>: Limitation de la recherche à des partitions de données spécifiques</p></li>
<li><p><strong>Pagination</strong>: Utilisation des paramètres de limite et de décalage pour l'extraction d'ensembles de résultats volumineux</p></li>
<li><p><strong>Sélection des champs de sortie</strong>: Contrôle des champs d'entité renvoyés avec les résultats</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">Techniques de recherche avancée</h3><h4 id="Range-Search" class="common-anchor-header">Recherche par plage</h4><p>La recherche par plage améliore la pertinence des résultats en les limitant aux vecteurs dont les scores de similarité se situent dans une plage spécifique. Contrairement à la recherche ANN standard, qui renvoie les K vecteurs les plus similaires, la recherche par plage définit une "région annulaire" à l'aide d'une limite extérieure (rayon) qui définit le niveau de similarité entre les vecteurs :</p>
<ul>
<li><p>une limite extérieure (rayon) qui fixe la distance maximale autorisée</p></li>
<li><p>une limite intérieure (range_filter) qui permet d'exclure les vecteurs trop similaires.</p></li>
</ul>
<p>Cette approche est particulièrement utile lorsque vous souhaitez trouver des éléments "similaires mais pas identiques", tels que des recommandations de produits qui sont liés mais pas des duplicatas exacts de ce qu'un utilisateur a déjà consulté.</p>
<h4 id="Filtered-Search" class="common-anchor-header">Recherche filtrée</h4><p>La recherche filtrée combine la similarité des vecteurs avec des contraintes de métadonnées pour limiter les résultats aux vecteurs qui correspondent à des critères spécifiques. Par exemple, dans un catalogue de produits, vous pouvez trouver des articles visuellement similaires mais limiter les résultats à une marque ou à une gamme de prix spécifique.</p>
<p>Les bases de données vectorielles hautement évolutives prennent en charge deux approches de filtrage :</p>
<ul>
<li><p><strong>Filtrage standard</strong>: Il applique des filtres de métadonnées avant la recherche de vecteurs, ce qui réduit considérablement le nombre de candidats.</p></li>
<li><p><strong>Filtrage itératif</strong>: Effectue d'abord une recherche vectorielle, puis applique des filtres à chaque résultat jusqu'à ce que le nombre de correspondances souhaité soit atteint.</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">Correspondance de texte</h4><p>La correspondance textuelle permet une recherche précise de documents sur la base de termes spécifiques, en complétant la recherche par similarité vectorielle par des capacités de correspondance textuelle exacte. Contrairement à la recherche sémantique, qui permet de trouver des contenus similaires sur le plan conceptuel, la correspondance textuelle se concentre sur la recherche d'occurrences exactes des termes de la requête.</p>
<p>Par exemple, une recherche de produits peut combiner la correspondance textuelle pour trouver les produits qui mentionnent explicitement "étanche" avec la similarité vectorielle pour trouver des produits visuellement similaires, en s'assurant que la pertinence sémantique et les exigences en matière de caractéristiques spécifiques sont satisfaites.</p>
<h4 id="Grouping-Search" class="common-anchor-header">Recherche par regroupement</h4><p>La recherche par regroupement permet d'agréger les résultats en fonction d'un champ spécifique afin d'améliorer la diversité des résultats. Par exemple, dans une collection de documents où chaque paragraphe est un vecteur distinct, le regroupement garantit que les résultats proviennent de différents documents plutôt que de plusieurs paragraphes d'un même document.</p>
<p>Cette technique est très utile dans les cas suivants</p>
<ul>
<li><p>les systèmes d'extraction de documents où l'on souhaite obtenir une représentation de différentes sources</p></li>
<li><p>les systèmes de recommandation qui doivent présenter diverses options</p></li>
<li><p>les systèmes de recherche où la diversité des résultats est aussi importante que la similarité.</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">Recherche hybride</h4><p>La recherche hybride combine les résultats de plusieurs champs vectoriels, chacun représentant potentiellement différents aspects des données ou utilisant différents modèles d'intégration. Cela permet</p>
<ul>
<li><p><strong>des combinaisons de vecteurs denses et épars</strong>: de combiner la compréhension sémantique (vecteurs denses) avec la correspondance des mots-clés (vecteurs peu denses) pour une recherche de texte plus complète.</p></li>
<li><p><strong>Recherche multimodale</strong>: Trouver des correspondances entre différents types de données, par exemple rechercher des produits en utilisant à la fois des images et du texte.</p></li>
</ul>
<p>Les implémentations de la recherche hybride utilisent des stratégies sophistiquées de reclassement pour combiner les résultats :</p>
<ul>
<li><p><strong>Classement pondéré</strong>: Classement pondéré : donne la priorité aux résultats provenant de champs vectoriels spécifiques</p></li>
<li><p><strong>Fusion de rangs réciproques</strong>: Équilibre les résultats entre tous les champs vectoriels sans priorité particulière.</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">Recherche en texte intégral</h4><p>Les capacités de recherche plein texte des bases de données vectorielles modernes comblent le fossé entre la recherche textuelle traditionnelle et la similarité vectorielle. Ces systèmes</p>
<ul>
<li><p>convertissent automatiquement les requêtes textuelles brutes en enregistrements épars</p></li>
<li><p>Récupèrent les documents contenant des termes ou des phrases spécifiques</p></li>
<li><p>classent les résultats en fonction de la pertinence des termes et de la similarité sémantique</p></li>
<li><p>Complètent la recherche vectorielle en détectant les correspondances exactes que la recherche sémantique pourrait manquer.</p></li>
</ul>
<p>Cette approche hybride est particulièrement utile pour les systèmes de <a href="https://zilliz.com/learn/what-is-information-retrieval">recherche d'informations</a> complets qui nécessitent à la fois une correspondance précise des termes et une compréhension sémantique.</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">Ingénierie des performances : Les mesures qui comptent<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>L'optimisation des performances des bases de données vectorielles passe par la compréhension des paramètres clés et de leurs compromis.</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">Le compromis rappel-débit</h3><p>Le rappel mesure la proportion de vrais voisins les plus proches trouvés parmi les résultats renvoyés. Un rappel plus élevé nécessite une recherche plus approfondie, ce qui réduit le débit (nombre de requêtes par seconde). Les systèmes de production équilibrent ces paramètres en fonction des exigences de l'application, en visant généralement un taux de rappel de 80 à 99 % en fonction du cas d'utilisation.</p>
<p>Lors de l'évaluation des performances des bases de données vectorielles, les environnements d'analyse comparative normalisés tels que ANN-Benchmarks fournissent des données comparatives précieuses. Ces outils mesurent des paramètres essentiels, notamment</p>
<ul>
<li><p>Le rappel de recherche : La proportion de requêtes pour lesquelles les vrais voisins les plus proches sont trouvés parmi les résultats renvoyés.</p></li>
<li><p>Requêtes par seconde (QPS) : La vitesse à laquelle la base de données traite les requêtes dans des conditions normalisées.</p></li>
<li><p>Performances sur des ensembles de données de tailles et de dimensions différentes</p></li>
</ul>
<p>Une autre solution consiste en un système d'analyse comparative à source ouverte appelé <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a>. VectorDBBench est un <a href="https://github.com/zilliztech/VectorDBBench">outil d'analyse comparative open-source</a> conçu pour évaluer et comparer les performances des principales bases de données vectorielles, telles que Milvus et Zilliz Cloud, en utilisant leurs propres ensembles de données. Il aide également les développeurs à choisir la base de données vectorielles la plus adaptée à leurs cas d'utilisation.</p>
<p>Ces benchmarks permettent aux organisations d'identifier la mise en œuvre de la base de données vectorielle la plus adaptée à leurs besoins spécifiques, en tenant compte de l'équilibre entre la précision, la vitesse et l'évolutivité.</p>
<h3 id="Memory-Management" class="common-anchor-header">Gestion de la mémoire</h3><p>Une gestion efficace de la mémoire permet aux bases de données vectorielles d'évoluer vers des milliards de vecteurs tout en maintenant les performances :</p>
<ul>
<li><p>L'<strong>allocation dynamique</strong> ajuste l'utilisation de la mémoire en fonction des caractéristiques de la charge de travail.</p></li>
<li><p>Les<strong>politiques de mise en cache</strong> conservent en mémoire les vecteurs fréquemment consultés.</p></li>
<li><p><strong>Les techniques de compression des vecteurs</strong> réduisent considérablement les besoins en mémoire.</p></li>
</ul>
<p>Pour les ensembles de données qui dépassent la capacité de la mémoire, les solutions basées sur les disques offrent une capacité cruciale. Ces algorithmes optimisent les schémas d'E/S pour les disques SSD NVMe grâce à des techniques telles que la recherche par faisceau et la navigation basée sur les graphes.</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">Filtrage avancé et recherche hybride</h3><p>Les bases de données vectorielles associent la similarité sémantique au filtrage traditionnel pour créer de puissantes capacités d'interrogation :</p>
<ul>
<li><p>Le<strong>pré-filtrage</strong> applique des contraintes de métadonnées avant la recherche vectorielle, réduisant ainsi l'ensemble des candidats à la comparaison de similarité.</p></li>
<li><p>Le<strong>post-filtrage</strong> exécute d'abord la recherche vectorielle, puis applique des filtres aux résultats.</p></li>
<li><p>L'<strong>indexation des métadonnées</strong> améliore les performances du filtrage grâce à des index spécialisés pour différents types de données.</p></li>
</ul>
<p>Les bases de données vectorielles performantes prennent en charge des modèles d'interrogation complexes combinant plusieurs champs vectoriels avec des contraintes scalaires. Les requêtes multi-vectorielles permettent de trouver des entités similaires à plusieurs points de référence simultanément, tandis que les requêtes vectorielles négatives excluent les vecteurs similaires aux exemples spécifiés.</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">Mise à l'échelle des bases de données vectorielles en production<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles nécessitent des stratégies de déploiement réfléchies pour garantir des performances optimales à différentes échelles :</p>
<ul>
<li><p>Les<strong>déploiements à petite échelle</strong> (des millions de vecteurs) peuvent fonctionner efficacement sur une seule machine dotée d'une mémoire suffisante.</p></li>
<li><p>Les<strong>déploiements à moyenne échelle</strong> (des dizaines à des centaines de millions) bénéficient d'une mise à l'échelle verticale avec des instances à mémoire élevée et un stockage SSD.</p></li>
<li><p><strong>Les déploiements à l'échelle du milliard</strong> nécessitent une mise à l'échelle horizontale sur plusieurs nœuds avec des rôles spécialisés.</p></li>
</ul>
<p>La répartition et la réplication constituent le fondement de l'architecture des bases de données vectorielles évolutives :</p>
<ul>
<li><p>La<strong>répartition horizontale</strong> divise les collections entre plusieurs nœuds.</p></li>
<li><p>La<strong>réplication</strong> crée des copies redondantes des données, améliorant ainsi la tolérance aux pannes et le débit des requêtes.</p></li>
</ul>
<p>Les systèmes modernes ajustent les facteurs de réplication de manière dynamique en fonction des schémas d'interrogation et des exigences de fiabilité.</p>
<h2 id="Real-World-Impact" class="common-anchor-header">Impact sur le monde réel<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>La flexibilité des bases de données vectorielles très performantes est évidente dans leurs options de déploiement. Les systèmes peuvent fonctionner dans un large éventail d'environnements, depuis les installations légères sur des ordinateurs portables pour le prototypage jusqu'aux clusters distribués massifs gérant des dizaines de milliards de vecteurs. Cette évolutivité a permis aux entreprises de passer du concept à la production sans changer de technologie de base de données.</p>
<p>Des entreprises telles que Salesforce, PayPal, eBay, NVIDIA, IBM et Airbnb s'appuient désormais sur des bases de données vectorielles telles que <a href="https://milvus.io/">Milvus</a> (open source) pour alimenter des applications d'IA à grande échelle. Ces implémentations couvrent divers cas d'utilisation - des systèmes sophistiqués de recommandation de produits à la modération de contenu, en passant par la détection des fraudes et l'automatisation du support client - tous construits sur la base de la recherche vectorielle.</p>
<p>Ces dernières années, les bases de données vectorielles sont devenues essentielles pour résoudre les problèmes d'hallucination courants dans les LLM en fournissant des données spécifiques à un domaine, actualisées ou confidentielles. Par exemple, <a href="https://zilliz.com/cloud">Zilliz Cloud</a> stocke des données spécialisées sous forme d'enchâssements de vecteurs. Lorsqu'un utilisateur pose une question, il transforme la requête en vecteurs, effectue des recherches ANN pour obtenir les résultats les plus pertinents et les combine avec la question originale afin de créer un contexte complet pour les grands modèles de langage. Ce cadre sert de base au développement d'applications fiables basées sur le LLM qui produisent des réponses plus précises et plus pertinentes sur le plan contextuel.</p>
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
    </button></h2><p>L'essor des bases de données vectorielles représente plus qu'une nouvelle technologie : il signifie un changement fondamental dans la manière dont nous abordons la gestion des données pour les applications d'intelligence artificielle. En comblant le fossé entre les données non structurées et les systèmes informatiques, les bases de données vectorielles sont devenues un composant essentiel de l'infrastructure moderne de l'IA, permettant aux applications de comprendre et de traiter l'information de manière de plus en plus humaine.</p>
<p>Les principaux avantages des bases de données vectorielles par rapport aux systèmes de base de données traditionnels sont les suivants :</p>
<ul>
<li><p>Recherche en haute dimension : Recherches de similarité efficaces sur des vecteurs à haute dimension utilisés dans les applications d'apprentissage automatique et d'intelligence artificielle générative.</p></li>
<li><p>Évolutivité : mise à l'échelle horizontale pour un stockage et une récupération efficaces de grandes collections de vecteurs.</p></li>
<li><p>Flexibilité avec la recherche hybride : Traitement de différents types de données vectorielles, y compris les vecteurs denses et peu denses.</p></li>
<li><p>Performance : Recherches de similarités vectorielles nettement plus rapides que dans les bases de données traditionnelles</p></li>
<li><p>Indexation personnalisable : Prise en charge de schémas d'indexation personnalisés optimisés pour des cas d'utilisation et des types de données spécifiques.</p></li>
</ul>
<p>Les applications d'IA devenant de plus en plus sophistiquées, les exigences en matière de bases de données vectorielles continuent d'évoluer. Les systèmes modernes doivent trouver un équilibre entre performance, précision, évolutivité et rentabilité, tout en s'intégrant de manière transparente à l'écosystème de l'IA au sens large. Pour les organisations qui cherchent à mettre en œuvre l'IA à grande échelle, la compréhension de la technologie des bases de données vectorielles n'est pas seulement une considération technique - c'est un impératif stratégique.</p>
