---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Gérer votre base de données vectorielles Milvus en un seul clic
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - un outil GUI pour Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture du Binlog</span> </span></p>
<p>Rédigé par <a href="https://github.com/czhen-zilliz">Zhen Chen</a> et transcrit par <a href="https://github.com/LocoRichard">Lichen Wang</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Cliquez <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">ici</a> pour consulter l'article original.</p> 
<p>Face à la demande croissante de traitement de données non structurées, Milvus 2.0 se distingue. Il s'agit d'un système de base de données vectorielles axé sur l'IA et conçu pour des scénarios de production massive. Outre tous ces SDK Milvus et Milvus CLI, une interface de ligne de commande pour Milvus, existe-t-il un outil qui permette aux utilisateurs d'exploiter Milvus de manière plus intuitive ? La réponse est OUI. Zilliz a annoncé une interface utilisateur graphique - Attu - spécifiquement pour Milvus. Dans cet article, nous aimerions vous montrer pas à pas comment effectuer une recherche de similarité vectorielle avec Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>L'île d'Attu</span> </span></p>
<p>En comparaison avec le CLI de Milvus qui apporte la plus grande simplicité d'utilisation, Attu offre plus de fonctionnalités :</p>
<ul>
<li>Installateurs pour Windows OS, macOS et Linux OS ;</li>
<li>Interface graphique intuitive pour faciliter l'utilisation de Milvus ;</li>
<li>Couverture des principales fonctionnalités de Milvus ;</li>
<li>Plugins pour l'extension des fonctionnalités personnalisées ;</li>
<li>Informations complètes sur la topologie du système pour faciliter la compréhension et l'administration de l'instance Milvus.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installation<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous pouvez trouver la dernière version d'Attu sur <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. Attu propose des installateurs exécutables pour différents systèmes d'exploitation. Il s'agit d'un projet open-source qui accepte les contributions de chacun.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>Installation d'Attu</span> </span></p>
<p>Vous pouvez également installer Attu via Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> est l'adresse IP de l'environnement où Attu s'exécute, et <code translate="no">milvus server IP</code> est l'adresse IP de l'environnement où Milvus s'exécute.</p>
<p>Après avoir installé Attu avec succès, vous pouvez saisir l'IP et le port de Milvus dans l'interface pour démarrer Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Connecter Milvus avec Attu</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">Vue d'ensemble des fonctionnalités<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>Page de présentation</span> </span></p>
<p>L'interface d'Attu se compose d'une page de <strong>présentation</strong>, d'une page de <strong>collection</strong>, d'une page de <strong>recherche de vecteurs</strong> et d'une page de <strong>vue du système</strong>, correspondant respectivement aux quatre icônes du volet de navigation de gauche.</p>
<p>La page de <strong>présentation</strong> affiche les collections chargées. La page <strong>Collection</strong> répertorie toutes les collections et indique si elles sont chargées ou libérées.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Page Collection</span> </span></p>
<p>Les pages <strong>Vector Search</strong> et <strong>System View</strong> sont des plugins d'Attu. Les concepts et l'utilisation de ces plugins seront présentés dans la dernière partie de ce blog.</p>
<p>Vous pouvez effectuer une recherche de similarité vectorielle dans la page <strong>Recherche vectorielle</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>Page Vector Search (Recherche vectorielle)</span> </span></p>
<p>Dans la page <strong>System View</strong>, vous pouvez vérifier la structure topologique de Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>Page Vue du système</span> </span></p>
<p>Vous pouvez également consulter les informations détaillées de chaque nœud en cliquant sur le nœud.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>Vue du nœud</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">Démonstration<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Explorons Attu avec un jeu de données de test.</p>
<p>Consultez notre <a href="https://github.com/zilliztech/attu/tree/main/examples">dépôt GitHub</a> pour obtenir le jeu de données utilisé dans le test suivant.</p>
<p>Tout d'abord, créez une collection nommée test avec les quatre champs suivants :</p>
<ul>
<li>Nom du champ : id, champ de clé primaire</li>
<li>Nom du champ : vector, vector field, float vector, Dimension : 128</li>
<li>Nom du champ : brand, champ scalaire, Int64</li>
<li>Nom du champ : color, champ scalaire, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>Créer une collection</span> </span></p>
<p>Charger la collection à des fins de recherche une fois qu'elle a été créée avec succès.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>Charger la collection</span> </span></p>
<p>Vous pouvez maintenant vérifier la collection nouvellement créée dans la page <strong>Vue d'ensemble</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>Vérifier la collection</span> </span></p>
<p>Importer l'ensemble de données de test dans Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importer les données</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importer les données</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importer des données</span> </span></p>
<p>Cliquer sur le nom de la collection dans la page Vue d'ensemble ou Collection pour accéder à l'interface de requête afin de vérifier les données importées.</p>
<p>Ajouter un filtre, spécifier l'expression <code translate="no">id != 0</code>, cliquer sur <strong>Appliquer le filtre</strong> et cliquer sur <strong>Requête</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>Interroger les données</span> </span></p>
<p>Vous constaterez que les cinquante entrées des entités ont été importées avec succès.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>Résultat de la requête</span> </span></p>
<p>Essayons la recherche de similarité vectorielle.</p>
<p>Copiez un vecteur du site <code translate="no">search_vectors.csv</code> et collez-le dans le champ <strong>Valeur du vecteur</strong>. Choisissez la collection et le champ. Cliquez sur <strong>Rechercher</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>Recherche de données</span> </span></p>
<p>Vous pouvez ensuite vérifier le résultat de la recherche. Sans compiler de scripts, vous pouvez facilement effectuer une recherche avec Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>Résultat de la recherche</span> </span></p>
<p>Enfin, vérifions la page <strong>Vue du système</strong>.</p>
<p>Grâce à l'API de métrologie encapsulée dans le SDK Milvus Node.js, vous pouvez vérifier l'état du système, les relations entre les nœuds et l'état des nœuds.</p>
<p>En tant que caractéristique exclusive d'Attu, la page Vue du système comprend un graphique topologique complet du système. En cliquant sur chaque nœud, vous pouvez vérifier son état (actualisation toutes les 10 secondes).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Graphique topologique des nœuds Milvus</span> </span></p>
<p>Cliquez sur chaque nœud pour accéder à la <strong>vue de la liste des nœuds</strong>. Vous pouvez vérifier tous les nœuds enfants d'un nœud de coordonnées. En triant les nœuds, vous pouvez identifier rapidement ceux dont l'utilisation du CPU ou de la mémoire est élevée et localiser le problème dans le système.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Liste des nœuds de Milvus</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">En outre<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme indiqué précédemment, les pages <strong>Recherche vectorielle</strong> et <strong>Vue du système</strong> sont des plugins d'Attu. Nous encourageons les utilisateurs à développer leurs propres plugins dans Attu pour répondre à leurs scénarios d'application. Dans le code source, il y a un dossier construit spécifiquement pour les codes des plugins.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>Les plugins</span> </span></p>
<p>Vous pouvez vous référer à n'importe quel plugin pour apprendre comment construire un plugin. En définissant le fichier de configuration suivant, vous pouvez ajouter le plugin à Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Ajouter des plugins à Attu</span> </span></p>
<p>Vous pouvez consulter <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> et <a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus Technical Document</a> pour des instructions détaillées.</p>
<p>Attu est un projet open-source. Toutes les contributions sont les bienvenues. Vous pouvez également <a href="https://github.com/zilliztech/attu/issues">déposer un problème</a> si vous avez des difficultés avec Attu.</p>
<p>Nous espérons sincèrement qu'Attu vous apportera une meilleure expérience utilisateur avec Milvus. Et si vous aimez Attu, ou si vous avez des commentaires sur son utilisation, vous pouvez répondre à cette <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">enquête auprès des utilisateurs d'Attu</a> afin de nous aider à optimiser Attu pour une meilleure expérience utilisateur.</p>
